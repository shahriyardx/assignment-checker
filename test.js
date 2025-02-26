function electionResult(votes) {
  if (Array.isArray(votes) && votes.every((item) => typeof item === "string")) {
    const mango = []
    const banana = []
    for (i of votes) {
      if (i.includes("mango")) {
        mango.push(i)
      }
      if (i.includes("banana")) {
        banana.push(i)
      }
    }

    if (mango.length > banana.length) {
      return "Mango"
    }
    if (banana.length > mango.length) {
      return "Banana"
    }

    return "Draw"
  }

  return "Invalid"
}

electionResult(["mango", "banana", "mango", "mango", "banana"])
