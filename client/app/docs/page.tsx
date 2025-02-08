import React from "react";

import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { title } from "@/components/primitives";

export default function DocsPage() {
  interface Endpoint {
    color:
      | "success"
      | "primary"
      | "danger"
      | "warning"
      | "default"
      | "secondary";
    method: "POST" | "GET" | "PUT" | "DELETE" | "Function";
    url: string;
  }

  interface RequestBody {
    [key: string]: string | number;
  }

  interface Superhero {
    id: number;
    name: string;
    superpower: string;
    humilityScore: number;
  }

  interface ResponseExample {
    message?: string;
    superhero?: Superhero;
    superheroes?: Superhero[];
  }

  interface CodeBlock {
    sectionId: string;
    title: string;
    endpoint: Endpoint;
    description: string;
    requestBody?: RequestBody;
    responseExample: ResponseExample;
  }

  interface CodeBlocks {
    add: CodeBlock;
    getAll: CodeBlock;
    deleteAll: CodeBlock;
    deleteByBody: CodeBlock;
    update: CodeBlock;
    initializeSuperheroes: CodeBlock;
  }

  const codeBlocks: CodeBlocks = {
    add: {
      sectionId: "add",
      title: "Add Hero",
      endpoint: {
        color: "success",
        method: "POST",
        url: "/api/superheroes",
      },
      description:
        "Creates a new superhero entry with a name, superpower, and humility score.",
      requestBody: {
        name: "string",
        superpower: "string",
        humilityScore: "number",
      },
      responseExample: {
        message: "Superhero added successfully!",
        superhero: {
          id: 2,
          name: "Batman",
          superpower: "Intelligence",
          humilityScore: 7,
        },
      },
    },
    getAll: {
      sectionId: "get-all",
      title: "Get All Heroes",
      endpoint: {
        color: "primary",
        method: "GET",
        url: "/api/superheroes",
      },
      description:
        "Retrieves a list of all superheroes in the database, sorted by humility score.",
      responseExample: {
        superheroes: [
          {
            id: 2,
            name: "string",
            superpower: "string",
            humilityScore: 5,
          },
        ],
      },
    },
    deleteAll: {
      sectionId: "delete-all",
      title: "Delete All Heroes",
      endpoint: {
        color: "danger",
        method: "DELETE",
        url: "/api/superheroes",
      },
      description:
        "Deletes all superheroes from the database. Use with caution as this action is irreversible.",
      responseExample: {
        message: "All superheroes deleted successfully!",
      },
    },
    deleteByBody: {
      sectionId: "delete-by-body",
      title: "Delete Hero by Body",
      endpoint: {
        color: "danger",
        method: "DELETE",
        url: "/api/superheroes",
      },
      description:
        "Deletes a superhero entry from the database based on the provided request body containing superhero details.",
      requestBody: {
        id: "number",
        name: "string",
        superpower: "string",
        humilityScore: "number",
      },
      responseExample: {
        message: "Superhero deleted successfully!",
      },
    },
    update: {
      sectionId: "update",
      title: "Update Hero",
      endpoint: {
        color: "warning",
        method: "PUT",
        url: "/api/superheroes",
      },
      description:
        "Updates an existing superhero entry with the provided name, superpower, and humility score.",
      requestBody: {
        id: "number",
        name: "string",
        superpower: "string",
        humilityScore: "number",
      },
      responseExample: {
        message: "Superhero updated successfully!",
      },
    },
    initializeSuperheroes: {
      sectionId: "initialize-superheroes",
      title: "Initialize Superheroes",
      endpoint: {
        color: "secondary",
        method: "Function",
        url: "No parameters",
      },
      description:
        "This function initializes the superheroes by first checking if there are any existing heroes. If there are none, it adds some default heroes.",
      responseExample: {
        message: "Superheroes initialized successfully!",
      },
    },
  };

  return (
    <div className="w-full mb-12 sm:mb-16">
      <h1 className={title()}>Docs</h1>
      <div className="docs-container text-left">
        <div className="toc">
          <h3>Table of Contents</h3>
          <ol className="toc-list">
            {Object.keys(codeBlocks).map((key) => {
              const block = codeBlocks[key as keyof typeof codeBlocks];

              return (
                <li key={key}>
                  <a href={`#${block.sectionId}`}>{block.title}</a>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-4 sm:mt-8">
          <h2 className={title({ size: "sm" })}>Project Overview</h2>
          <p className="mt-2">
            This project leverages Redis for improved performance, utilizing
            Redis&nbsp;
            <Code color="primary" size="sm">
              `SET`
            </Code>
            &nbsp; and&nbsp;
            <Code color="primary" size="sm">
              `ZADD`
            </Code>
            &nbsp; commands to store and retrieve superhero data. By using Redis
            as an in-memory data store, we ensure that API response times are
            fast, with a return time of approximately &nbsp;
            <Code color="default" size="sm">
              ~0.001s
            </Code>
            &nbsp; for retrieving data. Redis provides the scalability needed to
            handle large volumes of requests efficiently.
          </p>
        </div>
        {Object.keys(codeBlocks).map((key) => {
          const block = codeBlocks[key as keyof typeof codeBlocks];

          return (
            <section key={key} id={block.sectionId} className="mt-4 sm:mt-8">
              <h2 className={title({ size: "sm" })}>{block.title}</h2>

              <div className="mt-2">
                <Snippet
                  hideCopyButton
                  hideSymbol
                  color={block.endpoint.color}
                  variant="flat"
                >
                  <span>
                    <Code color={block.endpoint.color}>
                      {block.endpoint.method}
                    </Code>{" "}
                    {block.endpoint.url}
                  </span>
                </Snippet>
                <p className="mt-2">{block.description}</p>
              </div>

              <div className="mt-4">
                {block.requestBody && (
                  <>
                    <p>
                      <strong>Body Parameters:</strong>
                    </p>
                    <pre className="code-snippet">
                      {JSON.stringify(block.requestBody, null, 2)}
                    </pre>
                  </>
                )}

                <p className="mt-2">
                  <strong>Response:</strong>
                </p>
                <pre className="code-snippet">
                  {JSON.stringify(block.responseExample, null, 2)}
                </pre>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
