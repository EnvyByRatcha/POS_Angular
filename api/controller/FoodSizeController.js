const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const { name, price, remark, foodTypeId } = req.body;
      await prisma.foodSize.create({
        data: {
          name,
          addMoney: parseInt(price),
          remark,
          foodTypeId: parseInt(foodTypeId),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const { name, price, remark, foodTypeId, id } = req.body;
      await prisma.foodSize.update({
        data: {
          name,
          addMoney: parseInt(price),
          remark,
          foodTypeId: parseInt(foodTypeId),
        },
        where: {
          id,
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.foodSize.findMany({
        orderBy: {
          id: "desc",
        },
        include: {
          FoodType: true,
        },
        where: {
          status: "use",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.foodSize.update({
        data: {
          status: "delete",
        },

        where: {
          id: parseInt(req.params.id),
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  filter: async (req, res) => {
    try {
      const results = await prisma.foodSize.findMany({
        where: {
          foodTypeId: parseInt(req.params.foodTypeId),
          status: "use",
        },
        include: {
          FoodType: true,
        },
        orderBy: {
          addMoney: "asc",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
