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

function EditModal({
  API_URL,
  isOpen,
  onOpenChange,
  getHeroes,
  selectedHero,
  setSelectedHero,
}) {
  const isFormValid =
    selectedHero.name.trim() && selectedHero.superpower.trim();

  const editHero = async (heroData) => {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        toast.success("Superhero added successfully!");
        setSelectedHero({ name: "", superpower: "", humilityScore: 5 });
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
            <ModalHeader className="flex flex-col gap-1">Edit hero</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                variant="bordered"
                value={selectedHero.name}
                onChange={(e) =>
                  setSelectedHero({ ...selectedHero, name: e.target.value })
                }
              />
              <Input
                label="Superpower"
                variant="bordered"
                value={selectedHero.superpower}
                onChange={(e) =>
                  setSelectedHero({
                    ...selectedHero,
                    superpower: e.target.value,
                  })
                }
              />
              <Slider
                className="max-w-md"
                color="foreground"
                value={selectedHero.humilityScore}
                label="Humility Score"
                maxValue={10}
                minValue={0}
                showSteps={true}
                showOutline={true}
                size="md"
                step={1}
                onChange={(value) =>
                  setSelectedHero((prev) => ({
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
                  editHero(selectedHero);
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

export default EditModal;
