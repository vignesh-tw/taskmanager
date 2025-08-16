import Therapists from './pages/Therapists';
import Slots from './pages/Slots';
import Bookings from './pages/Bookings';
import ProtectedRoute from './components/ProtectedRoute'; // if you already have it

// inside <Routes>
<Route element={<ProtectedRoute />}>
  <Route path="/therapists" element={<Therapists />} />
  <Route path="/slots" element={<Slots />} />
  <Route path="/bookings" element={<Bookings />} />
</Route>

