/** `ac` = arkanya-client, `ap` = arkanya-product — ne pas suffixer "client". */
export function slugifyName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

export function buildRepoName(project: {
  slug: string
  destination: string
  client: { company: string; name: string } | null
}): string {
  const isClient =
    project.destination.startsWith("clients/") || Boolean(project.client)

  if (isClient) {
    const company = slugifyName(project.client?.company || project.client?.name || "")
    if (company && company !== "client") {
      return `ac-${company}-${project.slug}`
    }
    return `ac-${project.slug}`
  }

  return `ap-${project.slug}`
}
