import type { JsonData, Requirement, Section, SubRequirement } from "./types"

const getJsonDataLegacy = () => {
  const jsonDataLocal = JSON.parse(
    localStorage.getItem("assignment-data") as string,
  ) as JsonData & { data: { [key: string]: object } }
  const jsonData = jsonDataLocal.data

  const sections = []

  for (const sectionName in jsonData) {
    const requirements: Requirement[] = Object.values(
      jsonData[sectionName],
    ).map((requirement) => {
      const subreqs: SubRequirement[] = []
      for (const key in requirement) {
        if (key.startsWith("sub_req_")) {
          subreqs.push(requirement[key])
        }
      }
      const reqData = {
        data: {
          description: requirement.description,
          number: requirement.number,
          correct: requirement.correct,
          message: requirement.message,
        },
        subRequirements: subreqs,
      }

      return reqData
    })

    sections.push({
      name: sectionName,
      requirements,
    })
  }

  return { sections: sections }
}

export const getJsonData = () => {
  const jsonDataLocal = JSON.parse(
    localStorage.getItem("assignment-data") as string,
  )

  const jsonData = jsonDataLocal.data
  if (jsonData.type == "new") {
    return jsonData as { sections: Section[] }
  }

  return getJsonDataLegacy()
}
