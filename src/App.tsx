import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingContactButtons } from "@/components/FloatingContactButtons";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StayDetail from "./pages/StayDetail";
import DevelopmentDetail from "./pages/DevelopmentDetail";
import HotelDetail from "./pages/HotelDetail";
import PropertyRequest from "./pages/PropertyRequest";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import Stays from "./pages/Stays";
// Akumal
import StaysAkumal from "./pages/stays/StaysAkumal";
import AkumalOceanfront from "./pages/stays/akumal/AkumalOceanfront";
import AkumalWithPool from "./pages/stays/akumal/AkumalWithPool";
import AkumalByOwner from "./pages/stays/akumal/AkumalByOwner";
import AkumalPetFriendly from "./pages/stays/akumal/AkumalPetFriendly";
import AkumalLongTerm from "./pages/stays/akumal/AkumalLongTerm";
// Tulum
import StaysTulum from "./pages/stays/StaysTulum";
import TulumOceanfront from "./pages/stays/tulum/TulumOceanfront";
import TulumWithPool from "./pages/stays/tulum/TulumWithPool";
import TulumByOwner from "./pages/stays/tulum/TulumByOwner";
import TulumPetFriendly from "./pages/stays/tulum/TulumPetFriendly";
import TulumLongTerm from "./pages/stays/tulum/TulumLongTerm";
// Playa del Carmen
import StaysPlayaDelCarmen from "./pages/stays/StaysPlayaDelCarmen";
import PlayaDelCarmenOceanfront from "./pages/stays/playa-del-carmen/PlayaDelCarmenOceanfront";
import PlayaDelCarmenWithPool from "./pages/stays/playa-del-carmen/PlayaDelCarmenWithPool";
import PlayaDelCarmenByOwner from "./pages/stays/playa-del-carmen/PlayaDelCarmenByOwner";
import PlayaDelCarmenPetFriendly from "./pages/stays/playa-del-carmen/PlayaDelCarmenPetFriendly";
import PlayaDelCarmenLongTerm from "./pages/stays/playa-del-carmen/PlayaDelCarmenLongTerm";
// Cancun
import StaysCancun from "./pages/stays/StaysCancun";
import CancunOceanfront from "./pages/stays/cancun/CancunOceanfront";
import CancunWithPool from "./pages/stays/cancun/CancunWithPool";
import CancunByOwner from "./pages/stays/cancun/CancunByOwner";
import CancunPetFriendly from "./pages/stays/cancun/CancunPetFriendly";
import CancunLongTerm from "./pages/stays/cancun/CancunLongTerm";
// Puerto Morelos
import StaysPuertoMorelos from "./pages/stays/StaysPuertoMorelos";
import PuertoMorelosOceanfront from "./pages/stays/puerto-morelos/PuertoMorelosOceanfront";
import PuertoMorelosWithPool from "./pages/stays/puerto-morelos/PuertoMorelosWithPool";
import PuertoMorelosByOwner from "./pages/stays/puerto-morelos/PuertoMorelosByOwner";
import PuertoMorelosPetFriendly from "./pages/stays/puerto-morelos/PuertoMorelosPetFriendly";
import PuertoMorelosLongTerm from "./pages/stays/puerto-morelos/PuertoMorelosLongTerm";
// Isla Mujeres
import StaysIslaMujeres from "./pages/stays/StaysIslaMujeres";
import IslaMujeresOceanfront from "./pages/stays/isla-mujeres/IslaMujeresOceanfront";
import IslaMujeresWithPool from "./pages/stays/isla-mujeres/IslaMujeresWithPool";
import IslaMujeresByOwner from "./pages/stays/isla-mujeres/IslaMujeresByOwner";
import IslaMujeresPetFriendly from "./pages/stays/isla-mujeres/IslaMujeresPetFriendly";
import IslaMujeresLongTerm from "./pages/stays/isla-mujeres/IslaMujeresLongTerm";
// Other pages
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import ChichenItzaDetail from "./pages/ChichenItzaDetail";
import AkumalTourDetail from "./pages/AkumalTourDetail";
import DolphinTourDetail from "./pages/DolphinTourDetail";
import TourBookingSuccess from "./pages/TourBookingSuccess";
import Yachts from "./pages/Yachts";
import YachtDetail from "./pages/YachtDetail";
import Concierge from "./pages/Concierge";
import CustomPackage from "./pages/CustomPackage";
import RequestConfirmation from "./pages/RequestConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cancellation from "./pages/Cancellation";
import CalendarSync from "./pages/CalendarSync";
import IcalExportSources from "./pages/IcalExportSources";
import SeasonalPricing from "./pages/SeasonalPricing";
import PropertyManagement from "./pages/PropertyManagement";
import PropertyManagementCalculator from "./pages/PropertyManagementCalculator";
import Transportation from "./pages/Transportation";
import TransportationSuccess from "./pages/TransportationSuccess";
import TransportationCancel from "./pages/TransportationCancel";
import Flights from "./pages/Flights";
import CharterRequest from "./pages/CharterRequest";
import ExoticCarRentals from "./pages/ExoticCarRentals";
import CarRentals from "./pages/CarRentals";
import CarRentalDetail from "./pages/CarRentalDetail";
import CarRentalBookingSuccess from "./pages/CarRentalBookingSuccess";
import GolfCourses from "./pages/GolfCourses";
import GolfCourseDetail from "./pages/GolfCourseDetail";
import GolfBookingSuccess from "./pages/GolfBookingSuccess";
import CheckoutSummary from "./pages/CheckoutSummary";
import SharedCart from "./pages/SharedCart";
import ThankYou from "./pages/ThankYou";
import ContactOwners from "./pages/ContactOwners";
import Bundles from "./pages/Bundles";
import Members from "./pages/Members";
import MembersLogin from "./pages/MembersLogin";
import MembersResetPassword from "./pages/MembersResetPassword";
import MembersDashboard from "./pages/MembersDashboard";
import MembersRewards from "./pages/MembersRewards";
import AdminMembers from "./pages/AdminMembers";
import MemberArticle from "./pages/MemberArticle";

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <FloatingContactButtons />
            <FloatingCartButton />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/stays" element={<Stays />} />
              {/* Akumal */}
              <Route path="/stays/akumal" element={<StaysAkumal />} />
              <Route path="/stays/akumal/oceanfront" element={<AkumalOceanfront />} />
              <Route path="/stays/akumal/with-pool" element={<AkumalWithPool />} />
              <Route path="/stays/akumal/by-owner" element={<AkumalByOwner />} />
              <Route path="/stays/akumal/pet-friendly" element={<AkumalPetFriendly />} />
              <Route path="/stays/akumal/long-term" element={<AkumalLongTerm />} />
              {/* Tulum */}
              <Route path="/stays/tulum" element={<StaysTulum />} />
              <Route path="/stays/tulum/oceanfront" element={<TulumOceanfront />} />
              <Route path="/stays/tulum/with-pool" element={<TulumWithPool />} />
              <Route path="/stays/tulum/by-owner" element={<TulumByOwner />} />
              <Route path="/stays/tulum/pet-friendly" element={<TulumPetFriendly />} />
              <Route path="/stays/tulum/long-term" element={<TulumLongTerm />} />
              {/* Playa del Carmen */}
              <Route path="/stays/playa-del-carmen" element={<StaysPlayaDelCarmen />} />
              <Route path="/stays/playa-del-carmen/oceanfront" element={<PlayaDelCarmenOceanfront />} />
              <Route path="/stays/playa-del-carmen/with-pool" element={<PlayaDelCarmenWithPool />} />
              <Route path="/stays/playa-del-carmen/by-owner" element={<PlayaDelCarmenByOwner />} />
              <Route path="/stays/playa-del-carmen/pet-friendly" element={<PlayaDelCarmenPetFriendly />} />
              <Route path="/stays/playa-del-carmen/long-term" element={<PlayaDelCarmenLongTerm />} />
              {/* Cancun */}
              <Route path="/stays/cancun" element={<StaysCancun />} />
              <Route path="/stays/cancun/oceanfront" element={<CancunOceanfront />} />
              <Route path="/stays/cancun/with-pool" element={<CancunWithPool />} />
              <Route path="/stays/cancun/by-owner" element={<CancunByOwner />} />
              <Route path="/stays/cancun/pet-friendly" element={<CancunPetFriendly />} />
              <Route path="/stays/cancun/long-term" element={<CancunLongTerm />} />
              {/* Puerto Morelos */}
              <Route path="/stays/puerto-morelos" element={<StaysPuertoMorelos />} />
              <Route path="/stays/puerto-morelos/oceanfront" element={<PuertoMorelosOceanfront />} />
              <Route path="/stays/puerto-morelos/with-pool" element={<PuertoMorelosWithPool />} />
              <Route path="/stays/puerto-morelos/by-owner" element={<PuertoMorelosByOwner />} />
              <Route path="/stays/puerto-morelos/pet-friendly" element={<PuertoMorelosPetFriendly />} />
              <Route path="/stays/puerto-morelos/long-term" element={<PuertoMorelosLongTerm />} />
              {/* Isla Mujeres */}
              <Route path="/stays/isla-mujeres" element={<StaysIslaMujeres />} />
              <Route path="/stays/isla-mujeres/oceanfront" element={<IslaMujeresOceanfront />} />
              <Route path="/stays/isla-mujeres/with-pool" element={<IslaMujeresWithPool />} />
              <Route path="/stays/isla-mujeres/by-owner" element={<IslaMujeresByOwner />} />
              <Route path="/stays/isla-mujeres/pet-friendly" element={<IslaMujeresPetFriendly />} />
              <Route path="/stays/isla-mujeres/long-term" element={<IslaMujeresLongTerm />} />
              {/* Stay detail must come after specific routes */}
              <Route path="/stays/:id" element={<StayDetail />} />
              <Route path="/development/:id" element={<DevelopmentDetail />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/tours/chichen-itza" element={<ChichenItzaDetail />} />
              <Route path="/tours/akumal-sea-turtle" element={<AkumalTourDetail />} />
              <Route path="/tours/dolphin-swim-experience" element={<DolphinTourDetail />} />
              <Route path="/tours/booking-success" element={<TourBookingSuccess />} />
              <Route path="/tours/:id" element={<TourDetail />} />
              <Route path="/yachts" element={<Yachts />} />
              <Route path="/yachts/:id" element={<YachtDetail />} />
              <Route path="/concierge" element={<Concierge />} />
              <Route path="/custom-package" element={<CustomPackage />} />
              <Route path="/request-confirmation" element={<RequestConfirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/property-request" element={<PropertyRequest />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cancellation" element={<Cancellation />} />
              <Route path="/calendar-sync" element={<CalendarSync />} />
              <Route path="/ical-export-sources" element={<IcalExportSources />} />
              <Route path="/seasonal-pricing" element={<SeasonalPricing />} />
              <Route path="/property-management" element={<PropertyManagement />} />
              <Route path="/property-management/calculator" element={<PropertyManagementCalculator />} />
              <Route path="/activities/transportation" element={<Transportation />} />
              <Route path="/activities/transportation/success" element={<TransportationSuccess />} />
              <Route path="/activities/transportation/cancel" element={<TransportationCancel />} />
              <Route path="/activities/flights" element={<Flights />} />
              <Route path="/activities/flights/charter-request" element={<CharterRequest />} />
              <Route path="/activities/exotic-cars" element={<ExoticCarRentals />} />
              <Route path="/activities/car-rentals" element={<CarRentals />} />
              <Route path="/activities/car-rentals/booking-success" element={<CarRentalBookingSuccess />} />
              <Route path="/activities/car-rentals/:slug" element={<CarRentalDetail />} />
              <Route path="/activities/golf" element={<GolfCourses />} />
              <Route path="/activities/golf/booking-success" element={<GolfBookingSuccess />} />
              <Route path="/activities/golf/:courseId" element={<GolfCourseDetail />} />
              <Route path="/checkout-summary" element={<CheckoutSummary />} />
              <Route path="/cart/shared/:id" element={<SharedCart />} />

              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/contact-owners" element={<ContactOwners />} />
              <Route path="/bundles" element={<Bundles />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/login" element={<MembersLogin />} />
              <Route path="/members/reset-password" element={<MembersResetPassword />} />
              <Route path="/reset-password" element={<MembersResetPassword />} />
              <Route path="/members/rewards" element={<MembersRewards />} />
              <Route path="/members/dashboard" element={<MembersDashboard />} />
              <Route path="/members/journal/:id" element={<MemberArticle />} />
              <Route path="/admin/members" element={<AdminMembers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
