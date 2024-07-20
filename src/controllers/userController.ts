import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const url = process.env.GRAPHQL_ENDPOINT;
if (!url) {
  throw new Error("GRAPHQL_ENDPOINT is not defined in .env");
}

const headers = {
  "content-type": "application/json",
  "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "",
};

export const createUser = async (req: Request, res: Response) => {
  const { displayName, email, password, locale } = req.body;

  const user = {
    email,
    passwordHash: password,
    locale,
    displayName,
  };

  const query = `
    mutation insertUser($object: users_insert_input!) {
      insertUser(object: $object) {
        createdAt
        displayName
        email
        emailVerified
        id
        locale
        passwordHash
      }
    }
  `;

  const variables = {
    object: user,
  };

  try {
    const response = await axios.post(url, { query, variables }, { headers });

    if (response.data.errors) {
      return res.status(400).json({ errors: response.data.errors });
    }

    res.status(200).json(response.data.data.insertUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while inserting the user.",
    });
  }
};

// Get All Users
export const getAllUsers = async (req: Request, res: Response) => {
  const query = `
    query {
      users {
        id
        email
        createdAt
      }
    }
  `;
  try {
    const response = await axios.post(url, { query }, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error performing GraphQL query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const mutation = `
    mutation {
      deleteUser(id: "${id}") {
          id
      }
    }
  `;
  try {
    const response = await axios.post(url, { query: mutation }, { headers });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    res.status(200).json(response.data.data.deleteUser);
  } catch (error) {
    console.error("Error performing GraphQL mutation:", error);
    res.status(400).json({
      error: "An error occurred while deleting the user.",
    });
  }
};
