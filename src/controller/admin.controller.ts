import type { Request, Response } from "express";
import database from "../Database/sanity.client";
import Utility from "../Utility";
import bookMail from "../Mail/book";

const createMessage = async (email: string, message: string, id: string) => {
  await database.admin.create({
    _type: "message",
    emailId: {
      _type: "reference",
      _ref: id,
    },
    message: message,
  });
};

const newletter = async (req: Request, res: Response) => {
  const { email, message } = req.body;
  try {
    const query =
      "*[_type == 'newsletter' && email == $email]{...,'set':*[_type == 'message' && emailId._ref == ^._id]}";
    const finduser = await database.admin.fetch(query, { email: email });
    if (finduser && finduser.length > 0) {
      await createMessage(email, message, finduser[0]._id);
      return res.json(
        await Utility.resParams({
          status: true,
          message: "Message envoyée avec reussite",
        }),
      );
    }
    await bookMail.sendLetter(email);
    const createnewsletter = await database.admin.create({
      _type: "newsletter",
      email: email,
      abonne: true,
    });
    await createMessage(email, message, createnewsletter._id);
    return res.json(
      await Utility.resParams({
        status: true,
        message: "Message envoyée avec reussite et abonnement reussie",
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const getnewletter = async (req: Request, res: Response) => {
  try {
    const query =
      "*[_type == 'newsletter']{...,'set':*[_type == 'message' && emailId._ref == ^._id]}";
    const letter = await database.admin.fetch(query);
    return res.json(
      await Utility.resParams({
        status: true,
        message: "Abonnes recuperees avec reussite",
        data: letter,
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const query =
      "*[_type == 'User']{...,'set':*[_type == 'userParams' && userId._ref == ^._id]}";
    const alluser = await database.admin.fetch(query);
    return res.json(
      await Utility.resParams({
        status: true,
        message: "Abonnes recuperees avec reussite",
        data: alluser,
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const userdelete = async (req: Request, res: Response) => {
  const { data } = req.body;

  try {
    const queryUser =
      "*[_type == 'user'][{...,'set':*[_type == 'userParams' && userId._ref == ^._id][0]}";
    const query = "*[_type == 'userParams' && userId._ref == $id][0]";
    const queryPro = "*[_type == 'pro' && userId._ref == $id][0]";
    for (let x in data) {
      const trasaction = database.admin.transaction();
      const queryparams = await database.admin.fetch(query, { id: data[x] });
      const pro = await database.admin.fetch(queryPro, { id: data[x] });
      trasaction.delete(queryparams._id);
      if (pro) trasaction.delete(pro._id);
      trasaction.delete(data[x]);
      await trasaction.commit();
    }
    const allUser = await database.admin.fetch(queryUser);
    return res.json(
      await Utility.resParams({
        status: true,
        data: allUser,
        message: "ok",
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const admincontroller = {
  newletter,
  getnewletter,
  getAllUser,
  userdelete,
};

export default admincontroller;
