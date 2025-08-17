const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const { createBooking, deleteBooking } = require('../controllers/bookingController');

const { expect } = chai;

describe('Booking Tests', () => {

  afterEach(() => {
    sinon.restore(); 
  });

  it('should create a booking successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const slotId = new mongoose.Types.ObjectId();

    const req = { 
      user: { id: userId }, 
      body: { slotId: slotId.toString(), therapistId: new mongoose.Types.ObjectId().toString() } 
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

   
    sinon.stub(Slot, 'findById').resolves({ _id: slotId, isBooked: false, save: sinon.stub().resolves() });
    sinon.stub(Booking, 'findOne').resolves(null);
    const createdBooking = { _id: new mongoose.Types.ObjectId(), ...req.body, userId };
    sinon.stub(Booking, 'create').resolves(createdBooking);

    await createBooking(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ booking: createdBooking })).to.be.true;
  });

  it('should return 404 when deleting non-existent booking', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    sinon.stub(Booking, 'findById').resolves(null);

    await deleteBooking(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Booking not found' })).to.be.true;
  });

});
