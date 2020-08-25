import * as React from "react";
import { addMinutes, format, getUnixTime, startOfDay } from "date-fns";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import UserSettingsIcon from "@skbkontur/react-icons/UserSettings";
import { Schedule } from "../../../Domain/Schedule";
import { getPageLink } from "../../../Domain/Global";
import { Status } from "../../../Domain/Status";
import { Trigger, TriggerState } from "../../../Domain/Trigger";
import {
    Maintenances,
    getMaintenanceCaption,
    Maintenance,
    calculateMaintenanceTime,
} from "../../../Domain/Maintenance";
import { Statuses } from "../../../Domain/Status";
import getStatusColor, { unknownColor } from "../Styles/StatusColor";
import { getUTCDate, humanizeDuration } from "../../../helpers/DateUtil";

import MobileHeader from "../MobileHeader/MobileHeader";

import cn from "./MobileTriggerInfo.less";

type Props = {
    data: Trigger | null | undefined;
    triggerState: TriggerState | null | undefined;
    onThrottlingRemove: () => void;
    onSetMaintenance: (maintenance: number) => void;
};

type State = {
    showThrottling: boolean;
    showMaintenance: boolean;
};

function ScheduleView(props: { data: Schedule }): React.ReactElement {
    const { data } = props;
    const { days, startOffset, endOffset, tzOffset } = data;

    const startTime = format(addMinutes(startOfDay(getUTCDate()), startOffset), "HH:mm");

    const endTime = format(addMinutes(startOfDay(getUTCDate()), endOffset), "HH:mm");

    const timeZone = format(addMinutes(startOfDay(getUTCDate()), Math.abs(tzOffset)), "HH:mm");

    const timeZoneSign = tzOffset < 0 ? "+" : "−";
    const enabledDays = days.filter(({ enabled }) => enabled);
    return (
        <span>
            {days.length === enabledDays.length
                ? "Everyday"
                : enabledDays.map(({ name }) => name).join(", ")}{" "}
            {startTime}—{endTime} (GMT {timeZoneSign}
            {timeZone})
        </span>
    );
}

function checkMaintenance(maintenance: number | null | undefined): React.ReactNode {
    const delta = (maintenance || 0) - getUnixTime(getUTCDate());
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}

export default class MobileTriggerInfo extends React.Component<Props, State> {
    state: State = {
        showThrottling: false,
        showMaintenance: false,
    };

    render(): React.ReactNode {
        const { data: trigger, triggerState } = this.props;
        const { showThrottling, showMaintenance } = this.state;
        const { sched } = trigger || {};
        const { msg, maintenance } = triggerState || {};

        return (
            <div>
                <MobileHeader color={this.getHeaderColor()}>
                    <Sticky side="top">
                        <MobileHeader.HeaderBlock color={this.getHeaderColor()}>
                            <MobileHeader.LeftButton
                                icon={<ArrowChevronLeftIcon />}
                                linkTo={getPageLink("index")}
                            />
                            <MobileHeader.Title>
                                {trigger != null ? trigger.name : "Loading trigger..."}
                            </MobileHeader.Title>
                            <MobileHeader.RightButton
                                icon={<UserSettingsIcon />}
                                onClick={() => this.setState({ showMaintenance: true })}
                            />
                        </MobileHeader.HeaderBlock>
                    </Sticky>
                    <MobileHeader.DetailsBlock>
                        {trigger != null && (
                            <div className={cn("info")}>
                                <div className={cn("plain-row", "description")}>
                                    {trigger.desc && trigger.desc}
                                </div>
                                {sched != null && (
                                    <div className={cn("form-row")}>
                                        <div className={cn("caption")}>Schedule:</div>
                                        <div className={cn("value")}>
                                            <ScheduleView data={sched} />
                                        </div>
                                    </div>
                                )}
                                <div className={cn("form-row")}>
                                    <div className={cn("caption")}>Tags:</div>
                                    <div className={cn("value")}>
                                        {trigger.tags.map((x) => `#${x}`).join(", ")}
                                    </div>
                                </div>
                                {maintenance && (
                                    <div className={cn("form-row")}>
                                        <div className={cn("caption")}>Maintenance:</div>
                                        <div className={cn("value")}>
                                            {checkMaintenance(maintenance)}
                                        </div>
                                    </div>
                                )}
                                {(trigger.throttling !== 0 || showThrottling) && (
                                    <div className={cn("plain-row")}>
                                        <FlagSolidIcon />{" "}
                                        {trigger.throttling !== 0
                                            ? "Throttling enabled."
                                            : "No Throttling."}{" "}
                                        <BorderlessButton
                                            onClick={this.handleDisableThrottling}
                                            disabled={trigger.throttling === 0}
                                        >
                                            Disable
                                        </BorderlessButton>
                                    </div>
                                )}
                                {msg != null && msg !== "" && (
                                    <div className={cn("form-row")}>
                                        <div className={cn("caption")}>Exception:</div>
                                        <div className={cn("value")}>{msg}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </MobileHeader.DetailsBlock>
                </MobileHeader>
                {showMaintenance && (
                    <Modal noClose onClose={() => this.setState({ showMaintenance: false })}>
                        <Modal.Body>
                            <div className={cn("modal-content")}>
                                <div className={cn("modal-header")}>Maintenance trigger</div>
                                {Object.keys(Maintenances).map((key) => (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            this.handleSetMaintenance(key as Maintenance);
                                        }}
                                        className={cn("modal-button")}
                                        key={key}
                                    >
                                        {getMaintenanceCaption(key as Maintenance)}
                                    </button>
                                ))}
                            </div>
                        </Modal.Body>
                    </Modal>
                )}
            </div>
        );
    }

    handleDisableThrottling = (): void => {
        const { onThrottlingRemove } = this.props;
        this.setState({ showThrottling: true });
        onThrottlingRemove();
    };

    handleSetMaintenance = (interval: Maintenance): void => {
        const { onSetMaintenance } = this.props;
        this.setState({ showMaintenance: false });
        onSetMaintenance(calculateMaintenanceTime(interval));
    };

    getWorstTriggerState(): Status | null | undefined {
        const { data: trigger, triggerState } = this.props;
        if (trigger == null || triggerState == null) {
            return null;
        }
        const metrics = triggerState.metrics || {};
        const metricStatuses = Object.keys(Statuses).filter((x) =>
            Object.keys(metrics)
                .map((y) => metrics[y].state)
                .includes(x as Status)
        );
        const notOkStatuses = metricStatuses.filter((x) => x !== Statuses.OK);
        if (triggerState.state === Statuses.EXCEPTION) {
            return Statuses.EXCEPTION;
        }
        if (metricStatuses.length === 0) {
            return triggerState.state;
        }
        if (notOkStatuses.length === 0) {
            return Statuses.OK as Status;
        }
        if (notOkStatuses.includes(Statuses.ERROR)) {
            return Statuses.ERROR as Status;
        }
        if (notOkStatuses.includes(Statuses.WARN)) {
            return Statuses.WARN as Status;
        }
        return null;
    }

    getHeaderColor(): string {
        const state = this.getWorstTriggerState();
        if (state == null) {
            return unknownColor;
        }
        return getStatusColor(state);
    }
}

type BorderlessButtonProps = {
    children: React.ReactNode;
    disabled: boolean;
    onClick: () => void;
};

function BorderlessButton({
    children,
    disabled,
    onClick,
}: BorderlessButtonProps): React.ReactElement {
    return (
        <button type="button" onClick={onClick} className={cn("borderless-button", { disabled })}>
            <span>{children}</span>
        </button>
    );
}
