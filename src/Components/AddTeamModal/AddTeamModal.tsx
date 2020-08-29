import React, { ReactElement, useRef, useState } from "react";
import { Input, Modal, Textarea } from "@skbkontur/react-ui";
import { Button } from "@skbkontur/react-ui/components/Button";
import {
    ValidationContainer,
    ValidationWrapperV1,
    ValidationInfo,
} from "@skbkontur/react-ui-validations";
import { Team } from "../../Domain/Teams";
import { Form, FormRow } from "../Form/Form";
import { RowStack } from "@skbkontur/react-stack-layout";

interface AddTeamModalProps {
    teams?: Team[];
    addTeam: (name: string, description: string) => void;
    onClose: () => void;
}

export default function AddTeamModal(props: AddTeamModalProps): ReactElement {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const validationContainerEl = useRef<ValidationContainer>(null);

    const handleAddTeam = async () => {
        if (await validationContainerEl.current?.validate()) {
            props.addTeam(name, description);
        }
    };

    return (
        <Modal ignoreBackgroundClick onClose={props.onClose}>
            <Modal.Header>Team adding</Modal.Header>
            <Modal.Body>
                <ValidationContainer ref={validationContainerEl}>
                    <Form>
                        <FormRow label="Name">
                            <ValidationWrapperV1
                                validationInfo={validateTeamName(name, props.teams)}
                            >
                                <Input width="400px" value={name} onValueChange={setName} />
                            </ValidationWrapperV1>
                        </FormRow>
                        <FormRow label="Description">
                            <Textarea
                                width="400px"
                                autoResize
                                value={description}
                                onValueChange={setDescription}
                            />
                        </FormRow>
                    </Form>
                </ValidationContainer>
            </Modal.Body>
            <Modal.Footer panel>
                <RowStack gap={2} block baseline>
                    <Button onClick={handleAddTeam} use="primary">
                        Add Team
                    </Button>
                    <Button onClick={props.onClose}>Cancel</Button>
                </RowStack>
            </Modal.Footer>
        </Modal>
    );
}

function validateTeamName(name: string, teams?: Team[]): ValidationInfo | null {
    if (name.trim().length === 0) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }
    if (teams?.some((team) => team.name === name)) {
        return {
            type: "submit",
            message: `Team "${name}" already exist`,
        };
    }

    return null;
}
