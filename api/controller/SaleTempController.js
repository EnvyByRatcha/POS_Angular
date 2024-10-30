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
            qty: oldData.qty + 1,
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
          size: foodSize.name,
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
      const { saleTempId, tasteId } = req.body;
      await prisma.saleTempDetail.update({
        data: {
          tasteId,
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
                billSaleId: billSale.id,
                foodId: detail.foodId,
                tasteId: detail.tasteId,
                addMoney: detail.addMoney,
                price: detail.Food.price,
              },
            });
          }
        } else {
          if (item.qty > 0) {
            for (let j = 0; j < item.qty; j++) {
              await prisma.billSaleDetail.create({
                data: {
                  billSaleId: billSale.id,
                  foodId: item.foodId,
                  price: item.Food.price,
                },
              });
            }
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
          SaleTempDetail: true,
        },
        where: {
          userId,
          tableNo,
        },
      });

      const pdfkit = require("pdfkit");
      const fs = require("fs");
      const dayjs = require("dayjs");

      const paperWidth = 80;
      const padding = 3;

      const doc = new pdfkit({
        size: [80, 200],
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

      doc.font(font);
      doc.fontSize(5).text("*** ใบแจ้งรายการ ***", 20, doc.y + 8);
      doc.fontSize(8);
      doc.text(organization.name, padding, doc.y);

      doc.fontSize(5);
      doc.text(organization.address);
      doc.text(`เบอร์โทร: ${organization.phone}`);
      doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode}`);
      doc.text(`โต๊ะ: ${tableNo}`);
      doc.text(`วันที่: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm")}`, {
        align: "center",
      });
      doc.text("รายการอาหาร", { align: "center" });

      doc.moveDown();

      const y = doc.y;
      doc.fontSize(4);
      doc.text("รายการ", padding, y);
      doc.text("ราคา", padding + 18, y, { align: "right", width: 20 });
      doc.text("จำนวน", padding + 36, y, { align: "right", width: 20 });
      doc.text("รวม", padding + 55, y, { align: "right" });

      doc.lineWidth(0.1);
      doc
        .moveTo(padding, y + 6)
        .lineTo(paperWidth - padding, y + 6)
        .stroke();

      let sumAmount = 0;
      saleTemps.map((item, index) => {
        sumAmount += item.Food.price * item.qty;
        const y = doc.y;
        doc.text(item.Food.name, padding, y);
        doc.text(item.Food.price, padding + 18, y, {
          align: "right",
          width: 20,
        });
        doc.text(item.qty, padding + 36, y, { align: "right", width: 20 });
        doc.text(item.Food.price * item.qty, padding + 55, y, {
          align: "right",
        });
      });
      doc.text(`รวม: ${sumAmount} บาท`, padding, doc.y, {
        align: "right",
        width: paperWidth - padding * 2,
      });

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

      const paperWidth = 80;
      const padding = 3;

      const doc = new pdfkit({
        size: [80, 200],
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

      doc.font(font);
      doc.fontSize(5).text("*** ใบเสร็จรับเงิน ***", 20, doc.y + 8);
      doc.fontSize(8);
      doc.text(organization.name, padding, doc.y);

      doc.fontSize(5);
      doc.text(organization.address);
      doc.text(`เบอร์โทร: ${organization.phone}`);
      doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization.taxCode}`);
      doc.text(`โต๊ะ: ${tableNo}`);
      doc.text(`วันที่: ${dayjs(new Date()).format("DD/MM/YYYY HH:mm")}`, {
        align: "center",
      });
      doc.text("รายการอาหาร", { align: "center" });

      doc.moveDown();

      const y = doc.y;
      doc.fontSize(4);
      doc.text("รายการ", padding, y);
      doc.text("ราคา", padding + 18, y, { align: "right", width: 20 });
      doc.text("จำนวน", padding + 36, y, { align: "right", width: 20 });
      doc.text("รวม", padding + 55, y, { align: "right" });

      doc.lineWidth(0.1);
      doc
        .moveTo(padding, y + 6)
        .lineTo(paperWidth - padding, y + 6)
        .stroke();

      let sumAmount = 0;
      billSaleDetails.map((item, index) => {
        sumAmount += item.Food.price * 1;
        const y = doc.y;
        doc.text(item.Food.name, padding, y);
        doc.text(item.price, padding + 18, y, {
          align: "right",
          width: 20,
        });
        doc.text(1, padding + 36, y, { align: "right", width: 20 });
        doc.text(item.price * 1, padding + 55, y, {
          align: "right",
        });
      });

      doc.text(`รวม: ${sumAmount} บาท`, padding, doc.y, {
        align: "right",
        width: paperWidth - padding * 2,
      });
      doc.text(`รับเงิน: ${billSale.inputMoney} บาท`, padding, doc.y, {
        align: "right",
        width: paperWidth - padding * 2,
      });
      doc.text(`เงินทอน: ${billSale.returnMoney} บาท`, padding, doc.y, {
        align: "right",
        width: paperWidth - padding * 2,
      });

      doc.end();
      return res.send({ message: "success", fileName: fileName });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  updateQty: async (req, res) => {
    try {
      const { id } = req.body;

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

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ message: "success" });
    }
  },
};
