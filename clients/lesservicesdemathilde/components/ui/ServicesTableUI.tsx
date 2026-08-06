"use client";

import Link from "next/link";
import services from "@/data/services.json";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

export default function ServicesTableUI() {
  return (
    <div className="mt-12 overflow-x-auto">
      <div className="min-w-[700px]">
        <Table aria-label="Table des services">
          <TableHeader>
            <TableColumn>Prestations</TableColumn>
            <TableColumn className="text-center">Tarif</TableColumn>
            <TableColumn className="text-center">Après crédit</TableColumn>
            <TableColumn className="text-center">Éligible</TableColumn>
            <TableColumn className="text-center">Réserver</TableColumn>
          </TableHeader>

          <TableBody>
            {services.map((service) => {
              const isSAP = service.category === "sap";
              const pricing = service.pricing;

              return (
                <TableRow key={service.slug}>
                  <TableCell>
                    <div className="font-semibold text-[#809877]">{service.title}</div>
                  </TableCell>

                  <TableCell className="text-center">
                    {pricing.variants
                      ? pricing.variants.map((v, i) => (
                          <div key={i}>
                            {v.label}: <strong>{v.price}</strong>
                          </div>
                        ))
                      : pricing.base}
                  </TableCell>

                  <TableCell className="text-center">
                    {isSAP && pricing.reduced ? pricing.reduced : "-"}
                  </TableCell>

                  <TableCell className="text-center">{isSAP ? "Oui" : "Non"}</TableCell>

                  <TableCell className="text-center">
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="bg-[#809877] text-white px-3 py-2 rounded-md"
                    >
                      Réserver
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
