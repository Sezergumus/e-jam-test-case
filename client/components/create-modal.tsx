import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Slider } from "@heroui/slider";
import { toast } from "sonner";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

interface CreateModalProps {
  API_URL: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getHeroes: () => void;
}

function CreateModal({
  API_URL,
  isOpen,
  onOpenChange,
  getHeroes,
}: CreateModalProps) {
  const [newHero, setNewHero] = useState({
    name: "",
    superpower: "",
    humilityScore: 5,
  });

  const isFormValid = newHero.name.trim() && newHero.superpower.trim();

  interface Superhero {
    name: string;
    superpower: string;
    humilityScore: number;
  }

  const postHero = async (heroData: Superhero) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        toast.success("Superhero added successfully!");
        setNewHero({ name: "", superpower: "", humilityScore: 5 });
        getHeroes();
      } else {
        const data = await response.json();

        toast.error(data.errors[0].msg);
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="bottom-center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              New Superhero
            </ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                variant="bordered"
                value={newHero.name}
                onChange={(e) =>
                  setNewHero({ ...newHero, name: e.target.value })
                }
              />
              <Input
                label="Superpower"
                variant="bordered"
                value={newHero.superpower}
                onChange={(e) =>
                  setNewHero({ ...newHero, superpower: e.target.value })
                }
              />
              <Slider
                className="max-w-md"
                color="foreground"
                value={newHero.humilityScore}
                label="Humility Score"
                maxValue={10}
                minValue={0}
                showSteps={true}
                showOutline={true}
                size="md"
                step={1}
                onChange={(value) =>
                  setNewHero((prev) => ({
                    ...prev,
                    humilityScore: Array.isArray(value) ? value[0] : value,
                  }))
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                isDisabled={!isFormValid}
                onPress={() => {
                  postHero(newHero);
                  onClose();
                }}
              >
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateModal;
