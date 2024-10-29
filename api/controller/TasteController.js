const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const { name, remark, foodTypeId } = req.body;
      await prisma.taste.create({
        data: {
          name,
          remark,
          foodTypeId: parseInt(foodTypeId),
          status: "use",
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.taste.findMany({
        include: { FoodType: true },
        orderBy: {
          id: "desc",
        },
        where: { status: "use" },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const { name, remark, foodTypeId, id } = req.body;
      await prisma.taste.update({
        data: {
          name,
          remark,
          foodTypeId: parseInt(foodTypeId),
        },
        where: {
          id,
        },
      });

      res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.taste.update({
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
  listByFoodId: async (req, res) => {
    try {
      const results = await prisma.taste.findMany({
        where: {
          foodTypeId: parseInt(req.params.foodTypeId),
          status: "use",
        },
        orderBy: {
          name: "asc",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
