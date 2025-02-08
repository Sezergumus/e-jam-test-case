"use client";

import React, { useEffect, useState, useMemo, useCallback, Key } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from "@heroui/table";
import { Input } from "@heroui/input";
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
import { toast } from "sonner";

import {
  VerticalDotsIcon,
  SearchIcon,
  ChevronDownIcon,
  PlusIcon,
  RefreshIcon,
} from "./icons";

import CreateModal from "@/components/create-modal";
import EditModal from "@/components/edit-modal";

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
  { name: "ID", uid: "id" },
  { name: "NAME", uid: "name" },
  { name: "SUPERPOWER", uid: "superpower" },
  { name: "HUMILITY SCORE", uid: "humilityScore", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "superpower",
  "humilityScore",
  "actions",
];
interface Hero {
  id: number;
  name: string;
  superpower: string;
  humilityScore: number;
}

interface Superhero {
  id: number;
  name: string;
  superpower: string;
  humilityScore: number;
}

const API_URL = "http://localhost:5000/api/superheroes";
// const API_URL = "https://krqj7w6j-5000.euw.devtunnels.ms/api/superheroes";

export default function App() {
  type Selection = Set<string> | "all";

  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [fetchTime, setFetchTime] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "humilityScore",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const editModal = useDisclosure();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredHeroes = useMemo(() => {
    let filteredHeroes = [...superheroes];

    if (hasSearchFilter) {
      filteredHeroes = filteredHeroes.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredHeroes;
  }, [superheroes, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredHeroes.slice(start, end);
  }, [page, filteredHeroes, rowsPerPage]);

  const pages = Math.ceil(filteredHeroes.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Superhero, b: Superhero) => {
      const first = a[sortDescriptor.column as keyof Superhero] as number;
      const second = b[sortDescriptor.column as keyof Superhero] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items, superheroes]);

  const renderCell = useCallback((hero: Superhero, columnKey: Key) => {
    const cellValue = hero[columnKey as keyof Superhero];

    switch (columnKey) {
      case "humilityScore":
        return (
          <Chip
            color={
              hero.humilityScore >= 8
                ? "success"
                : hero.humilityScore >= 5
                  ? "warning"
                  : "danger"
            }
          >
            {hero.humilityScore}/10
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-white/25 dark:bg-black/25 backdrop-blur-lg border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-black dark:text-white" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="edit"
                  onPress={() => {
                    setSelectedHero(hero);
                    editModal.onOpen();
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  onPress={() => {
                    handleDelete(hero);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const getHeroes = async () => {
    try {
      const startTime = performance.now();
      const response = await fetch(API_URL);
      const data = await response.json();
      const endTime = performance.now();

      setSuperheroes(data);
      setFetchTime(Number(((endTime - startTime) / 1000).toFixed(2)));
    } catch (err) {
      console.error("Error fetching the superheroes: ", err);
    }
  };

  const getFetchStatus = (time: number | null) => {
    if (time === null) return "text-default-400"; // Default
    if (time < 0.5) return "text-green-500"; // Fast
    if (time >= 0.5 && time <= 1.5) return "text-yellow-500"; // Avg
    return "text-red-500"; // Slow
  };

  const handleDelete = async (hero: Superhero) => {
    try {
      const response = await fetch(API_URL + "/one", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hero),
      });

      if (response.ok) {
        toast.success("Superhero deleted successfully!");
        getHeroes();
      } else {
        const errorData = await response.json();

        toast.error(errorData.message || "Failed to delete superhero.");
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
    }
  };

  useEffect(() => {
    getHeroes();
  }, []);

  const classNames = useMemo(
    () => ({
      wrapper: ["bg-transparent", "p-0", "mx-auto"],
      table: [
        "dark:bg-white/10",
        "bg-white/25",
        "shadow-xl",
        "rounded-lg",
        "backdrop-blur-lg",
        "px-8",
        "w-1/2",
      ],
      th: [
        "bg-transparent",
        "text-default-500",
        "border-b",
        "border-divider",
        "text-base",
      ],
      td: [
        // changing the rows border radius
        "text-sm",
        // first
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
      tbody: ["table-body"],
    }),
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center sm:items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1 bg-white/10",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button isIconOnly size="sm" variant="light" onPress={getHeroes}>
              <RefreshIcon />
            </Button>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                  className="sm:text-base"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setVisibleColumns(keys as Selection)
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background sm:text-base"
              endContent={<PlusIcon />}
              size="sm"
              onPress={onOpen}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {filteredHeroes.length}/{superheroes.length} heroes shown!
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    superheroes.length,
    onRowsPerPageChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          Request took&nbsp;
          <span className={getFetchStatus(fetchTime)}>{fetchTime}</span>s!
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="w-full mt-8 sm:mt-12">
      <CreateModal
        API_URL={API_URL}
        getHeroes={getHeroes}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <EditModal
        API_URL={API_URL}
        getHeroes={getHeroes}
        isOpen={editModal.isOpen}
        selectedHero={selectedHero}
        setSelectedHero={setSelectedHero}
        onOpenChange={editModal.onOpenChange}
      />

      <Table
        aria-label="Superheroes list"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
        // @ts-ignore
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              aria-sort={sortDescriptor?.direction}
            >
              {column.name === "ID" ? "ID" : capitalize(column.name)}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No heroes found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
