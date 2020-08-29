import React from "react";
import { getPageLink } from "../../Domain/Global";
import { Team } from "../../Domain/Teams";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./TeamList.less";

interface TeamListProps {
    teams: Team[];
}

export default function TeamList(props: TeamListProps) {
    return (
        <div className={cn("teams")}>
            {props.teams.map((team) => (
                <div key={team.id}>
                    <RouterLink key={team.id} onClick={getPageLink("team", team.id)}>
                        <h2>{team.name}</h2>
                    </RouterLink>
                    <p className={cn("description")}>{team.description}</p>
                </div>
            ))}
        </div>
    );
}
