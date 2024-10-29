const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const organization = await prisma.organization.findFirst();

      const payload = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone ?? "",
        email: req.body.email ?? "",
        website: req.body.website ?? "",
        promptPay: req.body.promptPay ?? "",
        logo: req.body.logo ?? organization.logo,
        taxCode: req.body.taxCode ?? "",
      };

      if (organization) {
        if (req.body.logo) {
          const fs = require("fs");
          if (fs.existsSync(`uploads/${organization.logo}`)) {
            fs.unlinkSync(`uploads/${organization.logo}`);
          }
        }

        await prisma.organization.update({
          data: payload,
          where: {
            id:organization.id,
          },
        });
      } else {
        await prisma.organization.create({
          data: payload,
        });
      }
      return res.send({ message: "success" });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  info: async (req, res) => {
    try {
      const results = await prisma.organization.findMany();
      return res.send(results[0] ?? {});
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
  upload: async (req, res) => {
    try {
      const myFile = req.files.myFile;
      const fileName = myFile.name;

      const extenstion = fileName.split(".").pop();
      const newName = `${new Date().getTime()}.${extenstion}`;

      myFile.mv(`uploads/${newName}`, function (err) {
        if (err) {
          throw err;
        }
      });

      return res.send({ message: "success", fileName: newName });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  },
};
