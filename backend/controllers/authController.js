
const { User, Patient, Therapist } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, userType, ...additionalData } = req.body;
    const startedAt = Date.now();
    try {
        console.log('[REGISTER] incoming', { name, email, userType, additionalKeys: Object.keys(additionalData) });
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ message: 'Missing required fields', received: { name: !!name, email: !!email, password: !!password, userType } });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('[REGISTER] duplicate email', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!['patient', 'therapist'].includes(userType)) {
            console.log('[REGISTER] invalid userType', userType);
            return res.status(400).json({ message: 'Invalid user type. Must be either "patient" or "therapist"' });
        }

        let user;
        const userData = { name, email, password, userType, ...additionalData };
        console.log('[REGISTER] userData prepared', Object.keys(userData));

        if (userType === 'therapist') {
            if (userData.rate === undefined || userData.rate === null) {
                return res.status(400).json({ message: 'Therapist must have a valid rate (missing)' });
            }
            if (Number.isNaN(Number(userData.rate)) || Number(userData.rate) < 0) {
                return res.status(400).json({ message: 'Therapist must have a valid rate (NaN or negative)' });
            }
            userData.rate = Number(userData.rate);
            user = new Therapist(userData);
        } else {
            user = new Patient(userData);
        }

        await user.save();
        console.log('[REGISTER] saved user', { id: user._id.toString(), type: user.userType, ms: Date.now() - startedAt });
        const profileData = user.getProfileData();
        res.status(201).json({ ...profileData, token: generateToken(user.id) });
    } catch (error) {
        console.error('[REGISTER] error', error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            // Use polymorphic method to get appropriate profile data
            const profileData = user.getProfileData();
            res.json({ 
                ...profileData, 
                token: generateToken(user.id) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Use polymorphic method to get appropriate profile data
      const profileData = user.getProfileData();
      res.status(200).json(profileData);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update common fields
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;

        // Update user-type specific fields using polymorphism
        if (user.userType === 'patient') {
            if (req.body.university !== undefined) user.university = req.body.university;
            if (req.body.address !== undefined) user.address = req.body.address;
            if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;
            if (req.body.emergencyContact !== undefined) user.emergencyContact = req.body.emergencyContact;
        } else if (user.userType === 'therapist') {
            if (req.body.specialties !== undefined) user.specialties = req.body.specialties;
            if (req.body.languages !== undefined) user.languages = req.body.languages;
            if (req.body.rate !== undefined) user.rate = req.body.rate;
            if (req.body.bio !== undefined) user.bio = req.body.bio;
            if (req.body.qualifications !== undefined) user.qualifications = req.body.qualifications;
            if (req.body.experience !== undefined) user.experience = req.body.experience;
            if (req.body.availability !== undefined) user.availability = req.body.availability;
        }

        const updatedUser = await user.save();
        
        // Use polymorphic method to get updated profile data
        const profileData = updatedUser.getProfileData();
        res.json({ 
            ...profileData, 
            token: generateToken(updatedUser.id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
