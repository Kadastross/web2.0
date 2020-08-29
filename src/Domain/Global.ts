export const PagesPaths = {
    index: "/",
    trigger: "/trigger/:id",
    triggerEdit: "/trigger/:id/edit",
    triggerDuplicate: "/trigger/:id/duplicate",
    triggerAdd: "/trigger/new",
    settings: "/settings",
    notifications: "/notifications",
    tags: "/tags",
    patterns: "/patterns",
    teams: "/teams",
    team: "/team/:id",
};

export const PagesLinks = {
    index: "/",
    trigger: "/trigger/%id%",
    triggerEdit: "/trigger/%id%/edit",
    triggerDuplicate: "/trigger/%id%/duplicate",
    triggerAdd: "/trigger/new",
    settings: "/settings",
    notifications: "/notifications",
    tags: "/tags",
    patterns: "/patterns",
    docs: "//moira.readthedocs.org/",
    teams: "/teams",
    team: "/team/%id%",
};

export type PagePath = keyof typeof PagesPaths;

export type PageLink = keyof typeof PagesLinks;

export function getPagePath(page: PagePath): string {
    return PagesPaths[page];
}

export function getPageLink(page: PageLink, id?: string): string {
    return id ? PagesLinks[page].replace("%id%", id) : PagesLinks[page];
}
