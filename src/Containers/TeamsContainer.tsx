import React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { IMoiraApi } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { Team } from "../Domain/Teams";
import AddTeamModal from "../Components/AddTeamModal/AddTeamModal";
import TeamList from "../Components/TeamList/TeamList";

interface TeamsContainerState {
    teams?: Team[];
    loading?: boolean;
    error?: string;
    showAddTeamModal?: boolean;
}

class TeamsContainer extends React.Component<{ moiraApi: IMoiraApi }, TeamsContainerState> {
    public state: TeamsContainerState = {};

    public componentDidMount() {
        document.title = "Moira - Teams";
        this.getData();
    }

    public render(): React.ReactElement {
        return (
            <Layout loading={this.state.loading} error={this.state.error}>
                <LayoutContent>
                    <LayoutTitle>Teams</LayoutTitle>
                    <TeamList teams={this.state.teams ?? []} />
                    <Button onClick={this.handleOpenAddTeamModal}>Add Team</Button>
                    {this.state.showAddTeamModal ? (
                        <AddTeamModal
                            teams={this.state.teams}
                            onClose={this.handleCloseAddTeamModal}
                            addTeam={this.handleAddTeam}
                        />
                    ) : null}
                </LayoutContent>
            </Layout>
        );
    }

    private handleAddTeam = async (name: string, description: string) => {
        try {
            await this.props.moiraApi.addTeam(name, description);
            this.handleCloseAddTeamModal();
        } catch (error) {
            this.setState({ error: error.toString() });
        }
    };

    private handleOpenAddTeamModal = () => {
        this.setState({ showAddTeamModal: true });
    };

    private handleCloseAddTeamModal = () => {
        this.setState({ showAddTeamModal: false });
    };

    private async getData() {
        this.setState({ loading: true });
        try {
            const teams = await this.props.moiraApi.getTeams();
            this.setState({ teams });
        } catch (error) {
            this.setState({ error: error.toString() });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(TeamsContainer);
