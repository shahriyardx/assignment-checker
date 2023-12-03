export const enableJsonLoader = () => {
  const el = document.getElementById("import-json-btn")
  if (!el) return
  
  el.addEventListener("change", (e: Event) => {
    const input = e.target as HTMLInputElement
    const reader = new FileReader()

    reader.onload = function () {
      localStorage.setItem("assignment-data", reader.result as string)
    }
    if (input.files && input.files.length > 0) {
      reader.readAsText(input.files[0])
    }
  })
}
