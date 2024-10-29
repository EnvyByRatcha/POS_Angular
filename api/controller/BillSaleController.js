const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  list: async (req, res) => {
    try {
      const results = await prisma.billSale.findMany({
        where: {
          createdDate: {
            gte: req.body.startDate,
            lte: req.body.endDate,
          },
          status: "use",
        },
        include: {
          BillSaleDetail: true,
          User: true,
        },
        orderBy: {
          createdDate: "desc",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      const results = await prisma.billSale.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          status: "delete",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
