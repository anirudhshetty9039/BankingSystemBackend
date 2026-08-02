const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controller/account.controller");


const router = express.Router() ///;

/**
 * --Post /api/account/
 * - Create a new account for the user
 * -Protected route, only accessible to authenticated users
 
 */
router.post("/", authMiddleware.authMiddleware,accountController.createAccountController);


/**
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController);
 * - Get the account details of the authenticated user
 * -Protected route, only accessible to authenticated users
 */
router.get("/", authMiddleware.authMiddleware,accountController.getUserAccountController);


/**
 *  --Get /api/account/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);

 

module.exports = router;