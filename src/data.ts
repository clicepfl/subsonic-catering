"use server";

import fs from "node:fs";

import { Mutex } from "async-mutex";
import { existsSync, readFileSync } from "node:fs";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";
import Database from "better-sqlite3";

export interface Order {
  id: number;
  amounts: number[];
  register: string;
  prepared: boolean;
  served: boolean;
}

function runOnDb<T>(func: (db: Database.Database) => T) {
  const db = Database("db.sqlite");
  db.exec(fs.readFileSync("migration.sql").toString());
  const res = func(db);
  db.close();
  return res;
}

function parseOrders(orders: any): Order[] {
  return orders.map(parseOrder);
}

function parseOrder(order: any): Order {
  return { ...order, amounts: JSON.parse(order.amounts) };
}

export const addOrder = async (amounts: number[], register: string) =>
  runOnDb((db) =>
    parseOrder(
      db
        .prepare(
          "INSERT INTO orders(amounts, register) VALUES(?, ?) RETURNING *"
        )
        .get([JSON.stringify(amounts), register])
    )
  );

export const getOrders = async () =>
  runOnDb((db) => parseOrders(db.prepare("SELECT * FROM orders").all()));

export const getOrdersToPrepare = async () =>
  runOnDb((db) =>
    parseOrders(
      db.prepare("SELECT * FROM orders WHERE prepared = false;").all()
    )
  );

export const getOrdersToServe = async (register: string) =>
  runOnDb((db) =>
    parseOrders(
      db
        .prepare(
          "SELECT * FROM orders WHERE prepared = true AND served = false AND register = ?;"
        )
        .all([register])
    )
  );

export const markAsPrepared = async (id: number) =>
  runOnDb((db) =>
    db.prepare("UPDATE orders SET prepared = true WHERE id = ?;").run([id])
  );

export const markAsServed = async (id: number) =>
  runOnDb((db) =>
    db.prepare("UPDATE orders SET served = true WHERE id = ?;").run([id])
  );
