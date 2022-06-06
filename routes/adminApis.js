const CategoriesController = require('../controllers/Admin/CategoriesController')
const CourierController = require('../controllers/Admin/Courier')
const FaqController = require('../controllers/Faq')
const HomeOffersController = require('../controllers/HomeOffersController')
const SubOffersController = require('../controllers/SubOffersController')
const Admin = require('../controllers/Admin/Admin')

const router = new express.Router();

// router.post('/register', SellerController.register)
// router.post('/login', SellerController.doLogin)
// router.post('/profile', auth, SellerController.getProfile)
// router.post('/update/profile', auth, SellerController.updateProfile)
// router.post('/change/password', auth, SellerController.changePassword)
// router.post('/forgot/password', SellerController.sendOTP)
// router.post('/reset/password', SellerController.resetPassword)

//Home Page Sliders API
router.post('/updateWelcomeOffers', IMAGE_STORAGE.single('image'), HomeOffersController.updateWelcomeOffers)
router.post('/updateBigOfferSlider', IMAGE_STORAGE.single('image'), HomeOffersController.updateBigOfferSlider)
router.post('/updateTopSelectedBrandSlider', IMAGE_STORAGE.single('image'), HomeOffersController.updateTopSelectedBrandSlider)
router.post('/updateBestSellerSlider', IMAGE_STORAGE.single('image'), HomeOffersController.updateBestSellerSlider)
router.post('/updateBestSellingProductSlider', IMAGE_STORAGE.single('image'), HomeOffersController.updateBestSellingProductSlider)
router.post('/updateNewArrivalSlider', IMAGE_STORAGE.single('image'), HomeOffersController.updateNewArrivalSlider)

router.post('/deleteWelcomeOffers', HomeOffersController.deleteWelcomeOffers)
router.post('/deleteBigOfferSlider', HomeOffersController.deleteBigOfferSlider)
router.post('/deleteTopSelectedBrandSlider', HomeOffersController.deleteTopSelectedBrandSlider)
router.post('/deleteBestSellerSlider', HomeOffersController.deleteBestSellerSlider)
router.post('/deleteBestSellingProductSlider', HomeOffersController.deleteBestSellingProductSlider)
router.post('/deleteNewArrivalSlider', HomeOffersController.deleteNewArrivalSlider)

//Sub Page Sliders API
router.post('/updateNewArrivalOffers', IMAGE_STORAGE.single('image'), SubOffersController.updatenewArrivalSubPageSlider)
router.post('/updateBestSeller1Offers', IMAGE_STORAGE.single('image'), SubOffersController.updateSubBestSeller1Slider)
router.post('/updateBestSeller2Offers', IMAGE_STORAGE.single('image'), SubOffersController.updateSubBestSeller2Slider)

//Sub Page Sliders API
router.post('/deleteNewArrivalOffers', IMAGE_STORAGE.single('image'), SubOffersController.deletenewArrivalSubPageSlider)
router.post('/deleteBestSeller1Offers', IMAGE_STORAGE.single('image'), SubOffersController.deleteSubBestSeller1Slider)
router.post('/deleteBestSeller2Offers', IMAGE_STORAGE.single('image'), SubOffersController.deleteSubBestSeller2Slider)


// Categories
router.get('/categories', CategoriesController.getCategories)
router.get('/categories/:id', CategoriesController.getCategory)
router.post('/category/add', IMAGE_STORAGE.fields([{ name: 'banner', maxCount: 1 }]), CategoriesController.addCategory)
router.post('/category/update',IMAGE_STORAGE.fields([{ name: 'banner', maxCount: 1 }]),  CategoriesController.updateCategory)
router.post('/category/delete', CategoriesController.deleteCategory)

// Courier
router.get('/couriers', CourierController.getAllCouriors)
router.post('/courier/add', CourierController.addCourior)
router.post('/courier/delete', CourierController.deleteCourior)

// FAQ
router.post('/faq/add', FaqController.addFaq)

// Sellers
router.get('/sellers', Admin.allSellers)
router.get('/orders', Admin.allOrders)


// async function auth(req, res, next) {
//     try {
//         var token = req.header('X-Authentication-token');
//         if (!token) throw new Error('Invalid Request');

//         // DECRYPT
//         const getSellerFromToken = JWT.verify(token, CONFIG.JWT_KEY);

//         const seller = await _Seller.findById(getSellerFromToken.seller);
//         if (!seller) throw new Error('Invalid Token');

//         req.SellerAuth = await _.authResponse(seller)
//         req.role = 'Seller';

//         next();

//     } catch (error) {
//         _.res(res, error.message, 401);
//     }
// }

module.exports = router;