const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const { foodId, qty, tableNo, userId } = req.body;

      const food = await prisma.food.findFirst({
        where: {
          id: parseInt(foodId),
        },
      });

      const oldData = await prisma.saleTemp.findFirst({
        where: {
          foodId,
        },
      });

      if (oldData == null) {
        await prisma.saleTemp.create({
          data: {
            foodId,
            qty,
            price: food.price,
            userId,
            tableNo,
          },
        });
      } else {
        await prisma.saleTemp.update({
          data: {
            qty: {
              increment:1
            },
          },
          where: {
            id: oldData.id,
          },
        });
      }

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.saleTemp.findMany({
        include: { Food: true, SaleTempDetail: true },
        where: {
          userId: parseInt(req.params.userId),
          qty: {
            gt: 0,
          },
        },
        orderBy: {
          id: "desc",
        },
      });

      await prisma.saleTemp.deleteMany({
        where: {
          userId: parseInt(req.params.userId),
          qty: 0,
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  clear: async (req, res) => {
    try {
      const saleTemp = await prisma.saleTemp.findMany({
        where: {
          userId: parseInt(req.params.userId),
        },
      });

      for (let i = 0; i < saleTemp.length; i++) {
        await prisma.saleTempDetail.deleteMany({
          where: {
            saleTempId: saleTemp[i].id,
          },
        });
      }

      await prisma.saleTemp.deleteMany({
        where: {
          userId: parseInt(req.params.userId),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          SaleTempDetail: true,
        },
        where: {
          foodId: parseInt(req.params.foodId),
          userId: parseInt(req.params.userId),
        },
      });

      for (let i = 0; i < saleTemps.length; i++) {
        if (saleTemps[i].SaleTempDetail.length > 0) {
          const saleTempId = saleTemps[i].id;

          await prisma.saleTempDetail.deleteMany({
            where: {
              saleTempId: saleTempId,
            },
          });
        }
      }

      await prisma.saleTemp.deleteMany({
        where: {
          foodId: parseInt(req.params.foodId),
          userId: parseInt(req.params.userId),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  changeQty: async (req, res) => {
    try {
      const { id, style } = req.body;

      const oldData = await prisma.saleTemp.findFirst({
        where: {
          id,
        },
      });

      let oldQty = oldData.qty;
      if (style == "plus") {
        oldQty += 1;
      } else {
        oldQty -= 1;
        if (oldQty < 0) {
          oldQty = 0;
        }
      }

      await prisma.saleTemp.update({
        data: { qty: oldQty },
        where: {
          id,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  createDetail: async (req, res) => {
    try {
      const { foodId, qty, saleTempId } = req.body;

      const oldData = await prisma.saleTempDetail.findFirst({
        where: {
          foodId,
          saleTempId,
        },
      });

      if (oldData == null) {
        for (let i = 0; i < qty; i++) {
          await prisma.saleTempDetail.create({
            data: {
              foodId,
              saleTempId,
            },
          });
        }
      }

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  listSaletempDetail: async (req, res) => {
    try {
      const results = await prisma.saleTempDetail.findMany({
        include: {
          Food: true,
        },
        where: {
          saleTempId: parseInt(req.params.saleTempId),
        },
        orderBy: {
          id: "desc",
        },
      });

      const arr = [];

      for (let i = 0; i < results.length; i++) {
        const item = results[i];

        if (item.tasteId != null) {
          const taste = await prisma.taste.findFirst({
            where: {
              id: item.tasteId,
            },
          });
          item.tasteName = taste.name;
        }
        arr.push(item);
      }

      return res.send({ results: arr });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  updateFoodSize: async (req, res) => {
    try {
      const { foodSizeId, saleTempId } = req.body;
      const foodSize = await prisma.foodSize.findFirst({
        where: {
          id: foodSizeId,
        },
      });

      await prisma.saleTempDetail.update({
        data: {
          addMoney: foodSize.addMoney,
          foodSizeId,
        },
        where: {
          id: saleTempId,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  updateTaste: async (req, res) => {
    try {
      const { saleTempId, tasteId, selected } = req.body;

      if (selected == "select") {
        await prisma.saleTempDetail.update({
          data: {
            tasteId,
          },
          where: {
            id: saleTempId,
          },
        });
      } else {
        await prisma.saleTempDetail.update({
          data: {
            tasteId: null,
          },
          where: {
            id: saleTempId,
          },
        });
      }

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  newSaleTempDetail: async (req, res) => {
    try {
      const { saleTempId, foodId } = req.body;

      await prisma.saleTemp.update({
        data: {
          qty: {
            increment: 1,
          },
        },
        where: {
          id: saleTempId,
        },
      });

      await prisma.saleTempDetail.create({
        data: {
          saleTempId,
          foodId,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  removeSaleTempDetail: async (req, res) => {
    try {
      const { id, qty, saleTempId } = req.body;

      await prisma.saleTempDetail.delete({
        where: {
          id,
        },
      });

      await prisma.saleTemp.update({
        data: {
          qty: qty - 1,
        },
        where: {
          id: saleTempId,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  endSale: async (req, res) => {
    try {
      const { amount, inputMoney, payType, returnMoney, tableNo, userId } =
        req.body;
      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          SaleTempDetail: {
            include: {
              Food: true,
            },
          },
          Food: true,
        },
        where: {
          userId,
        },
      });

      const billSale = await prisma.billSale.create({
        data: {
          amount,
          inputMoney,
          payType,
          returnMoney,
          tableNo,
          userId,
        },
      });

      for (let i = 0; i < saleTemps.length; i++) {
        const item = saleTemps[i];

        if (item.SaleTempDetail.length > 0) {
          for (let j = 0; j < item.SaleTempDetail.length; j++) {
            const detail = item.SaleTempDetail[j];

            await prisma.billSaleDetail.create({
              data: {
                foodId: detail.foodId,
                billSaleId: billSale.id,
                foodSizeId: detail.foodSizeId,
                tasteId: detail.tasteId,
                addMoney: detail.addMoney,
                price: detail.Food.price,
                qty: detail.qty,
              },
            });
          }
        } else {
          if (item.qty > 0) {
            await prisma.billSaleDetail.create({
              data: {
                billSaleId: billSale.id,
                foodId: item.foodId,
                price: item.Food.price,
                qty: item.qty,
              },
            });
          } else {
            await prisma.billSaleDetail.create({
              data: {
                billSaleId: billSale.id,
                foodId: item.foodId,
                price: item.Food.price,
              },
            });
          }
        }
      }

      for (let i = 0; i < saleTemps.length; i++) {
        const item = saleTemps[i];

        await prisma.saleTempDetail.deleteMany({
          where: {
            saleTempId: item.id,
          },
        });
      }

      await prisma.saleTemp.deleteMany({
        where: {
          userId,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  printBillBeforePay: async (req, res) => {
    try {
      const { userId, tableNo } = req.body;
      const organization = await prisma.organization.findFirst();

      const saleTemps = await prisma.saleTemp.findMany({
        include: {
          Food: true,
          SaleTempDetail: {
            include: {
              FoodSize: true,
            },
          },
        },
        where: {
          userId,
          tableNo,
        },
      });

      const pdfkit = require("pdfkit");
      const fs = require("fs");
      const dayjs = require("dayjs");

      let calPaperHeight = 0;
      saleTemps.map((item, index) => {
        calPaperHeight += item.SaleTempDetail.length;
      });

      const paperWidth = 80;
      const paperHeight = calPaperHeight * 5 + 125;
      const padding = 3;

      const doc = new pdfkit({
        size: [paperWidth, paperHeight],
        margin: 3,
      });
      const fileName = `uploads/bill-${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )}.pdf`;
      const font = "Kanit/kanit-regular.ttf";

      doc.pipe(fs.createWriteStream(fileName));

      const imageWidth = 25;
      const positionX = parseInt(paperWidth / 2) - imageWidth / 2;
      doc.image("uploads/" + organization.logo, positionX, 5, {
        align: "center",
        width: imageWidth,
        height: 25,
      });

      doc.moveDown();

      doc.fontSize(4);
      doc.font(font);
      doc.text("*** ใบแจ้งรายการ ***", padding, doc.y + 8, { align: "center" });
      doc
        .fontSize(6)
        .text(organization.name, padding, doc.y, { align: "center" });

      doc.fontSize(3);
      doc.text(organization.address, padding, doc.y - 2, { align: "center" });
      doc.text(`TAXID : ${organization.taxCode}`, { align: "center" });
      doc.text(`TEL : ${organization.phone}`, { align: "center" });

      doc.moveDown(0.5);
      doc.lineWidth(0.1);
      doc
        .moveTo(padding, doc.y)
        .lineTo(paperWidth - padding, doc.y)
        .dash(1, { space: 1 })
        .stroke();

      doc.moveDown(0.5);
      doc.fontSize(4);
      let y = doc.y;
      doc.text(
        `DATE: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm")}`,
        padding,
        y,
        {
          align: "left",
        }
      );
      doc.text(`TABLE : ${tableNo}`, padding, y, { align: "right" });
      doc.text(`ORDER : ORD00002065OC`);

      doc.moveDown(0.5);
      doc.lineWidth(0.1);
      doc
        .moveTo(padding, doc.y)
        .lineTo(paperWidth - padding, doc.y)
        .stroke();

      doc.moveDown(0.5);
      let sumAmount = 0;

      saleTemps.map((item, index) => {
        const details = item.SaleTempDetail;

        details.map((detail, index) => {
          const y = doc.y;
          const name = detail.foodSizeId
            ? item.Food.name + " (" + detail.FoodSize.name + ")"
            : item.Food.name;
          const price = (item.Food.price + detail.addMoney) * detail.qty;
          sumAmount += price;

          doc.text(name, padding, y);
          doc.text(detail.qty, padding + 40, y, {
            align: "right",
            width: 10,
          });
          doc.text(price.toFixed(2), padding + 55, y, {
            align: "right",
          });
        });
      });

      doc.moveDown(0.5);
      doc.lineWidth(0.1);
      doc
        .moveTo(padding, doc.y)
        .lineTo(paperWidth - padding, doc.y)
        .stroke();

      doc.moveDown(0.5);

      y = doc.y;
      doc.text("รวม", padding, y, { align: "left" });
      doc.text(sumAmount.toFixed(2), padding, y, { align: "right" });
      y = doc.y;
      doc.text("ส่วนลด", padding, y, { align: "left" });
      doc.text("0.00", padding, y, { align: "right" });

      y = doc.y;
      doc.fontSize(6);
      doc.text("ยอดชำระสุทธิ", padding, y);
      doc.text(sumAmount.toFixed(2), padding, y, {
        align: "right",
        width: paperWidth - padding * 2,
      });

      doc.moveDown(0.5);
      doc.fontSize(4);
      doc.text("*** กรุณาตรวจสอบรายการให้ถูกต้อง ***", { align: "center" });
      doc.text("ขอขอบพระคุณเป็นอย่างสูง", { align: "center" });

      doc.end();

      return res.send({ message: "success", fileName: fileName });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  printBillAfterPay: async (req, res) => {
    try {
      const { userId, tableNo } = req.body;
      const organization = await prisma.organization.findFirst();

      const billSale = await prisma.billSale.findFirst({
        where: {
          userId,
          tableNo,
          status: "use",
        },
        include: {
          BillSaleDetail: {
            include: {
              Food: true,
              FoodSize: true,
              Taste: true,
            },
          },
          User: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const billSaleDetails = billSale.BillSaleDetail;

      const pdfkit = require("pdfkit");
      const fs = require("fs");
      const dayjs = require("dayjs");

      let calPaperHeight = billSaleDetails.length;

      const paperWidth = 80;
      const paperHeight = calPaperHeight * 5 + 135;
      const padding = 3;

      const doc = new pdfkit({
        size: [paperWidth, paperHeight],
        margin: 3,
      });
      const fileName = `uploads/invoice-${dayjs(new Date()).format(
        "YYYYMMDDHHmmss"
      )}.pdf`;
      const font = "Kanit/kanit-regular.ttf";

      doc.pipe(fs.createWriteStream(fileName));

      const imageWidth = 25;
      const positionX = parseInt(paperWidth / 2) - imageWidth / 2;
      doc.image("uploads/" + organization.logo, positionX, 5, {
        align: "center",
        width: imageWidth,
        height: 25,
      });

      doc.moveDown();

      doc.fontSize(4);
      doc.font(font);
      doc.text("*** ใบเสร็จรับเงิน ***", padding, doc.y + 8, {
        align: "center",
      });
      doc
        .fontSize(6)
        .text(organization.name, padding, doc.y, { align: "center" });

      doc.fontSize(3);
      doc.text(organization.address, padding, doc.y - 2, { align: "center" });
      doc.text(`TAXID : ${organization.taxCode}`, { align: "center" });
      doc.text(`TEL : ${organization.phone}`, { align: "center" });

      doc.moveDown(0.5);
      doc.lineWidth(0.1);
      doc
        .moveTo(padding, doc.y)
        .lineTo(paperWidth - padding, doc.y)
        .dash(1, { space: 1 })
        .stroke();

      doc.moveDown(0.5);
      doc.fontSize(4);
      let y = doc.y;
      doc.text(
        `DATE: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm")}`,
        padding,
        y,
        {
          align: "left",
        }
      );
      doc.text(`TABLE : ${tableNo}`, padding, y, { align: "right" });
      doc.text(`ORDER : ORD00002065OC`);

      doc.moveDown(0.5);
      doc.lineWidth(0.1);
      doc
        .moveTo(padding, doc.y)
        .lineTo(paperWidth - padding, doc.y)
        .stroke();

      doc.moveDown(0.5);

      let sumAmount = 0;

      billSaleDetails.map((item, index) => {
        const y = doc.y;

        const price = (item.Food.price + item.addMoney) * item.qty;
        sumAmount += price;

        const name = `${item.Food.name}${
          item.tasteId ? "/" + item.Taste.name : ""
        } ${item.foodSizeId ? " (" + item.FoodSize.name + ") " : ""}`;

        doc.text(name, padding, y);
        doc.text(item.qty, padding + 30, y, {
          align: "right",
          width: 20,
        });
        doc.text(price.toFixed(2), padding + 55, y, {
          align: "right",
        });
      });

      doc.moveDown(0.5);
      doc.lineWidth(0.1);
      doc
        .moveTo(padding, doc.y)
        .lineTo(paperWidth - padding, doc.y)
        .stroke();

      doc.moveDown(0.5);

      y = doc.y;
      doc.text("รวม", padding, y, { align: "left" });
      doc.text(sumAmount.toFixed(2), padding, y, { align: "right" });
      y = doc.y;
      doc.text("ส่วนลด", padding, y, { align: "left" });
      doc.text("0.00", padding, y, { align: "right" });

      y = doc.y;
      doc.fontSize(6);
      doc.text("ยอดชำระสุทธิ", padding, y);
      doc.text(sumAmount.toFixed(2), padding, y, {
        align: "right",
        width: paperWidth - padding * 2,
      });
      y = doc.y;
      doc.fontSize(4);
      doc.text("รับเงิน", padding, y);
      doc.text(billSale.inputMoney.toFixed(2), padding, y, {
        align: "right",
        width: paperWidth - padding * 2,
      });
      y = doc.y;
      doc.text("เงินทอน", padding, y);
      doc.text(billSale.returnMoney.toFixed(2), padding, y, {
        align: "right",
        width: paperWidth - padding * 2,
      });

      doc.moveDown(0.5);
      doc.text("*** กรุณาตรวจสอบรายการให้ถูกต้อง ***", { align: "center" });
      doc.text("ขอขอบพระคุณเป็นอย่างสูง", { align: "center" });

      doc.end();

      await prisma.billSale.update({
        data: {
          invoice: fileName,
        },
        where: {
          id: billSale.id,
        },
      });

      return res.send({
        message: "success",
        fileName: fileName,
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  updateQty: async (req, res) => {
    try {
      const { id, condition } = req.body;

      if (condition == "plus") {
        const saleTempDetail = await prisma.saleTempDetail.update({
          data: {
            qty: {
              increment: 1,
            },
          },
          where: {
            id,
          },
        });

        await prisma.saleTemp.update({
          data: {
            qty: {
              increment: 1,
            },
          },
          where: {
            id: saleTempDetail.saleTempId,
          },
        });
      } else {
        const saleTempDetail = await prisma.saleTempDetail.update({
          data: {
            qty: {
              decrement: 1,
            },
          },
          where: {
            id,
          },
        });

        await prisma.saleTemp.update({
          data: {
            qty: {
              decrement: 1,
            },
          },
          where: {
            id: saleTempDetail.saleTempId,
          },
        });
      }

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ message: "success" });
    }
  },
};
