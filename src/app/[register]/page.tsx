"use client";

import MenuSelect from "@/components/MenuSelect";
import OrderStatus from "@/components/OrderStatus";
import {
  addOrder,
  Order,
  getOrders,
  markAsServed,
  Menu,
  getMenus,
  cancelOrder,
  markAsNotServed,
} from "@/data";
import { delay } from "@/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const register = params["register"] as string;
  const [orders, setOrders] = useState([] as Order[]);
  const [menus, setMenus] = useState([] as Menu[]);

  useEffect(() => {
    let fetch = true;
    let fn = async () => {
      while (fetch) {
        setOrders(await getOrders());
        setMenus(await getMenus());
        await delay(1000);
      }
    };

    fn();

    return () => {
      fetch = false;
    };
  }, []);

  const [currentOrder, setCurrentOrder] = useState(new Array(4).fill(0));

  return (
    <div className="register">
      <div className="register-select">
        <div className="menu-selections">
          {menus.map((m, i) => (
            <MenuSelect
              key={i}
              menu={m}
              numSelects={currentOrder[i]}
              remaining={m.stocks}
              addSelect={() => {
                const newOrder = [...currentOrder];
                newOrder[i] += 1;
                setCurrentOrder(newOrder);
              }}
              removeSelect={() => {
                const newOrder = [...currentOrder];
                newOrder[i] -= 1;
                setCurrentOrder(newOrder);
              }}
            />
          ))}
        </div>
        <button
          onClick={async () => {
            try {
              await addOrder(currentOrder, register);
            } catch {
              alert(
                "ERROR SENDING ORDER ! There are no more stocks available for the selected items."
              );
            }
            setCurrentOrder(new Array(menus.length).fill(0));
          }}
        >
          Send Order
        </button>
      </div>
      <div className="register-orders">
        <h1>Register {register}</h1>

        <Link className="admin-button" href="/">
          Admin
        </Link>
        {menus.length == 0 ? (
          <></>
        ) : (
          orders
            .filter((o) => o.register === register && !o.canceled)
            .sort((a, b) => {
              if (a.served !== b.served) return a.served ? 1 : -1;
              if (a.prepared !== b.prepared) return a.prepared ? -1 : 1;
              return b.id - a.id;
            })
            .map((o) => (
              <OrderStatus
                key={o.id}
                menuItems={menus}
                order={o}
                buttonText={
                  o.served ? "Undo Serve" : o.prepared ? "Serve" : "Cancel"
                }
                buttonAction={
                  o.served
                    ? markAsNotServed
                    : o.prepared
                    ? markAsServed
                    : (id: number) => {
                        if (
                          confirm("Are you sure you want to cancel this order?")
                        ) {
                          cancelOrder(id);
                        }
                      }
                }
                actionAvailable={true}
                actionIsDanger={!o.prepared && !o.served}
                showDetails={false}
                showRegister={false}
                archived={o.served}
                statusIcon={o.served ? "✅" : o.prepared ? "🥪❗" : "⏳"}
              />
            ))
        )}
      </div>
    </div>
  );
}
