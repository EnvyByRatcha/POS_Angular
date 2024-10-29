const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const { name, price, remark, img, foodType, foodTypeId } = req.body;

      await prisma.food.create({
        data: {
          name,
          price,
          remark,
          img: img ?? "",
          foodType,
          foodTypeId:parseInt(foodTypeId),
          status: "use",
        },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const { name, price, remark, foodType, foodTypeId, id } = req.body;

      let image = req.body.img;
      if (image === undefined) {
        const row = await prisma.food.findFirst({
          where: { id },
        });

        image = row.img;
      }
      await prisma.food.update({
        data: {
          name,
          price,
          remark,
          foodType,
          foodTypeId:parseInt(foodTypeId),
          img: image,
        },
        where: { id },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
  list: async (req, res) => {
    try {
      const results = await prisma.food.findMany({
        include: {
          FoodType: true,
        },
        orderBy: {
          id: "desc",
        },
        where: {
          status: "use",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
  filter: async (req, res) => {
    try {
      const results = await prisma.food.findMany({
        include: {
          FoodType: true,
        },
        where: {
          foodType: req.params.foodType,
          status: "use",
        },
        orderBy: {
          id: "desc",
        },
      });

      return res.send({ results: results });
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
  upload: async (req, res) => {
    try {
      if (req.files.img !== undefined) {
        const img = req.files.img;
        const fileName = img.name;

        img.mv("uploads/" + fileName, (err) => {
          if (err) {
            res.send({ error: err });
          }
        });

        return res.send({ fileName: fileName });
      } else {
        return res.send({ message: "file not found" });
      }
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
  remove: async (req, res) => {
    try {
      await prisma.food.update({
        data: {
          status: "delete",
        },
        where: { id: parseInt(req.params.id) },
      });

      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ message: e.message });
    }
  },
};
