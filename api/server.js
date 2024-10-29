const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userController = require("./controller/UserController");
const foodTypeController = require("./controller/FoodTypeController");
const FoodSizeController = require("./controller/FoodSizeController");
const TasteController = require("./controller/TasteController");
const FoodController = require("./controller/FoodController");
const SaleTempController = require("./controller/SaleTempController");
const OrganizationController = require("./controller/OrganizationController");
const BillSaleController = require("./controller/BillSaleController");
const ReportController = require("./controller/ReportController");
const UserController = require("./controller/UserController");

app.use(cors());
app.use(fileUpload());
app.use("/uploads", express.static("./uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*---Middleware--*/
function isSignIn(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const level = decode.level;

    if (level !== null) {
      next();
    } else {
      return res.status(401).send({ error: "unauthorized" });
    }
  } catch (e) {
    return res.status(401).send({ error: "unauthorized" });
  }
}

/*---UserController--*/
app.post("/api/user/signIn", (req, res) => userController.signIn(req, res));
app.get("/api/user/list", (req, res) => UserController.list(req, res));
app.post("/api/user/create", (req, res) => UserController.create(req, res));
app.put("/api/user/update/:id", (req, res) => UserController.update(req, res));
app.delete("/api/user/remove/:id", (req, res) =>
  UserController.remove(req, res)
);
app.get("/api/user/getLevelFromToken", (req, res) =>
  UserController.getLevelFromToken(req, res)
);

/*---foodTypeController--*/
app.post("/api/foodType/create", (req, res) =>
  foodTypeController.create(req, res)
);
app.get("/api/foodType/list", (req, res) => foodTypeController.list(req, res));
app.delete("/api/foodType/remove/:id", (req, res) =>
  foodTypeController.remove(req, res)
);
app.put("/api/foodType/update", (req, res) =>
  foodTypeController.update(req, res)
);

/*---foodSizeController--*/
app.get("/api/foodSize/list", (req, res) => FoodSizeController.list(req, res));
app.post("/api/foodSize/create", (req, res) =>
  FoodSizeController.create(req, res)
);
app.put("/api/foodSize/update", (req, res) =>
  FoodSizeController.update(req, res)
);
app.delete("/api/foodSize/remove/:id", (req, res) =>
  FoodSizeController.remove(req, res)
);
app.get("/api/foodSize/filter/:foodTypeId", (req, res) =>
  FoodSizeController.filter(req, res)
);

/*---TasteController--*/
app.post("/api/taste/create", (req, res) => TasteController.create(req, res));
app.get("/api/taste/list", (req, res) => TasteController.list(req, res));
app.put("/api/taste/update", (req, res) => TasteController.update(req, res));
app.delete("/api/taste/remove/:id", (req, res) =>
  TasteController.remove(req, res)
);
app.get("/api/taste/listByFoodId/:foodTypeId", (req, res) =>
  TasteController.listByFoodId(req, res)
);

/*---FoodController--*/
app.post("/api/food/create", (req, res) => FoodController.create(req, res));
app.put("/api/food/update", (req, res) => FoodController.update(req, res));
app.get("/api/food/list", (req, res) => FoodController.list(req, res));
app.post("/api/food/upload", (req, res) => FoodController.upload(req, res));
app.delete("/api/food/remove/:id", (req, res) =>
  FoodController.remove(req, res)
);
app.get("/api/food/filter/:foodType", (req, res) =>
  FoodController.filter(req, res)
);

/*---SaleTempController--*/
app.post("/api/saleTemp/create", (req, res) =>
  SaleTempController.create(req, res)
);
app.get("/api/saletemp/list/:userId", (req, res) =>
  SaleTempController.list(req, res)
);
app.delete("/api/saleTemp/clear/:userId", (req, res) =>
  SaleTempController.clear(req, res)
);
app.delete("/api/saleTemp/remove/:foodId/:userId", (req, res) =>
  SaleTempController.remove(req, res)
);
app.put("/api/saleTemp/changeQty", (req, res) =>
  SaleTempController.changeQty(req, res)
);
app.post("/api/saleTemp/createDetail", (req, res) =>
  SaleTempController.createDetail(req, res)
);
app.get("/api/saleTemp/listSaleTempDetail/:saleTempId", (req, res) =>
  SaleTempController.listSaletempDetail(req, res)
);
app.post("/api/saleTemp/updateFoodSize", (req, res) =>
  SaleTempController.updateFoodSize(req, res)
);
app.post("/api/saleTemp/updateTaste", (req, res) =>
  SaleTempController.updateTaste(req, res)
);
app.post("/api/saleTemp/newSaleTempDetail", (req, res) =>
  SaleTempController.newSaleTempDetail(req, res)
);
app.delete("/api/saleTemp/removeSaleTempDetail/:id", (req, res) =>
  SaleTempController.removeSaleTempDetail(req, res)
);
app.post("/api/saleTemp/endSale", (req, res) =>
  SaleTempController.endSale(req, res)
);
app.post("/api/saletemp/printBillBeforePay", (req, res) =>
  SaleTempController.printBillBeforePay(req, res)
);
app.post("/api/saletemp/printBillAfterPay", (req, res) =>
  SaleTempController.printBillAfterPay(req, res)
);

/*---OrganizationController--*/
app.post("/api/organization/save", (req, res) =>
  OrganizationController.create(req, res)
);
app.get("/api/organization/info", (req, res) =>
  OrganizationController.info(req, res)
);
app.post("/api/organization/upload", (req, res) =>
  OrganizationController.upload(req, res)
);

/*---BillSaleController--*/
app.post("/api/billSale/list", (req, res) => BillSaleController.list(req, res));
app.delete("/api/billSale/remove/:id", (req, res) =>
  BillSaleController.remove(req, res)
);

/*---ReportController--*/
app.post("/api/report/sumPerDay", isSignIn, (req, res) =>
  ReportController.sumPerDay(req, res)
);
app.post("/api/report/sumPerMonth", isSignIn, (req, res) =>
  ReportController.sumPerMonth(req, res)
);

app.listen(3000, () => {
  console.log("server start...");
});
