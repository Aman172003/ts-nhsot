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

export const getTodos = async (req: Request, res: Response) => {
  const query = `
    query {
      todos {
        id
        name
        is_completed
        user_id
      }
    }
  `;
  try {
    const response = await axios.post(url, { query }, { headers });
    res.status(200).json(response.data.data.todos);
  } catch (error) {
    console.error("Error performing GraphQL query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const insertTodo = async (req: Request, res: Response) => {
  const { name, isCompleted, userId } = req.body;

  const mutation = `
    mutation {
      insert_todos_one(object: { name: "${name}", is_completed: ${isCompleted}, user_id: "${userId}" }) {
        id
      }
    }
  `;
  try {
    const response = await axios.post(url, { query: mutation }, { headers });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    res.status(201).json({
      message: "Successfully inserted",
      id: response.data.data.insert_todos_one.id,
    });
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, isCompleted } = req.body;
  const mutation = `
    mutation {
      update_todos_by_pk(pk_columns: {id: "${id}"}, _set: { name: "${name}", is_completed: ${isCompleted} }) {
        id
      }
    }
  `;
  try {
    const response = await axios.post(url, { query: mutation }, { headers });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    res.json({
      message: "Successfully inserted",
      id: response.data.data.update_todos_by_pk.id,
    });
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const mutation = `
    mutation {
      delete_todos_by_pk(id: "${id}") {
        id
      }
    }
  `;
  try {
    const response = await axios.post(url, { query: mutation }, { headers });
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    res.json({
      message: "Successfully deleted",
      id: response.data.data.delete_todos_by_pk.id,
    });
  } catch (error: unknown) {
    res.status(400).json({ error: (error as Error).message });
  }
};
