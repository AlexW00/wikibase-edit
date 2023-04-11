///

export default function (config: GeneralConfig) : wbEdit

interface wbEdit {
  label: {
    set: ({ id: string, language: string, value: string }) => Promise;
  }
}
