import { CompositeDisposable, TextEditor } from "atom"
import { OutlineView } from "./outlineView"
import { OutlineProvider } from "atom-ide-base"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"
import { notifyError } from "./utils"

export { statuses } from "./statuses" // for spec
import { statuses } from "./statuses"
import debounce from "lodash/debounce"

const subscriptions = new CompositeDisposable()

let view: OutlineView | undefined
export const outlineProviderRegistry = new ProviderRegistry<OutlineProvider>()

// let busySignalProvider: BusySignalProvider | undefined // service might be consumed late

export function activate() {
  addCommands()
  addObservers()
  if (atom.config.get("atom-ide-outline.initialDisplay")) {
    // initially show outline pane
    toggleOutlineView().catch((e) => {
      notifyError(e)
    })
  }
}

export function deactivate() {
  onDidCompositeDisposable?.dispose?.()
  subscriptions.dispose()
  view?.destroy()
  view = undefined
}

// export function consumeSignal(registry: BusySignalRegistry) {
//   busySignalProvider = registry.create()
//   subscriptions.add(busySignalProvider)
// }

export async function consumeOutlineProvider(provider: OutlineProvider) {
  subscriptions.add(/*  providerRegistryEntry */ outlineProviderRegistry.addProvider(provider))

  // Generate (try) an outline after obtaining a provider
  await getOutline()
}

function addCommands() {
  subscriptions.add(
    /* outlineToggle */ atom.commands.add("atom-workspace", "outline:toggle", toggleOutlineView),
    /* revealCursor */ atom.commands.add("atom-workspace", "outline:reveal-cursor", revealCursor)
  )
}

const longLineLength = atom.config.get("linter-ui-default.longLineLength") || 4000
const largeFileLineCount = atom.config.get("linter-ui-default.largeFileLineCount") / 6 || 3000 // minimum number of lines to trigger large file optimizations
function lineCountIfLarge(editor: TextEditor) {
  // @ts-ignore
  if (editor.largeFileMode) {
    return 20000
  }
  const lineCount = editor.getLineCount()
  if (lineCount >= largeFileLineCount) {
    return lineCount
  } else {
    const buffer = editor.getBuffer()
    for (let i = 0, len = lineCount; i < len; i++) {
      if (buffer.lineLengthForRow(i) > longLineLength) {
        return longLineLength
      }
    }
    return 0 // small file
  }
}

// disposables returned inside the oberservers
let onDidCompositeDisposable: CompositeDisposable | null

function addObservers() {
  onDidCompositeDisposable = new CompositeDisposable()
  const activeTextEditorObserver = atom.workspace.observeActiveTextEditor(editorChanged)
  subscriptions.add(activeTextEditorObserver)
}

async function editorChanged(editor?: TextEditor) {
  if (editor === undefined) {
    return
  }
  // dispose the old subscriptions
  onDidCompositeDisposable?.dispose?.()

  await getOutline(editor) // initial outline

  const lineCount = lineCountIfLarge(editor as TextEditor)
  // How long to wait for the new changes before updating the outline.
  // A high number will increase the responsiveness of the text editor in large files.
  const updateDebounceTime = Math.max(lineCount / 5, 300) // 1/5 of the line count

  const doubouncedGetOutline = debounce(getOutline as (textEditor: TextEditor) => Promise<void>, updateDebounceTime)

  onDidCompositeDisposable!.add(
    // update the outline if editor stops changing
    editor.onDidStopChanging(async () => {
      await doubouncedGetOutline(editor)
    }),

    // clean up if the editor editor is closed
    editor.onDidDestroy(() => {
      setStatus("noEditor")
    })
  )
}

export function revealCursor() {
  const editor = atom.workspace.getActiveTextEditor()
  if (editor === undefined) {
    return
  }

  // following cursor disposable
  if (view !== undefined) {
    view.selectAtCursorLine(editor.getCursors()[0])
  }
}

export async function toggleOutlineView() {
  if (view === undefined) {
    view = new OutlineView() // create outline pane
  }
  const outlinePane = atom.workspace.paneForItem(view)
  if (outlinePane) {
    outlinePane.destroyItem(view)
    return
  }

  const rightDock = atom.workspace.getRightDock()
  const [pane] = rightDock.getPanes()

  pane.addItem(view)
  pane.activateItem(view)

  rightDock.show()

  // Trigger an editor change whenever an outline is toggeled.
  try {
    await editorChanged(atom.workspace.getActiveTextEditor())
  } catch (e) {
    notifyError(e)
  }
}

export async function getOutline(editor = atom.workspace.getActiveTextEditor()) {
  if (view === undefined) {
    view = new OutlineView() // create outline pane
  }
  // if outline is not visible return
  if (!view.isVisible()) {
    return
  }
  // editor
  if (editor === undefined) {
    return setStatus("noEditor")
  }

  // provider
  const provider = outlineProviderRegistry.getProviderForEditor(editor)

  if (!provider) {
    return setStatus("noProvider")
  }

  // const target = editor.getPath()

  // const busySignalID = `Outline: ${target}`
  // // @ts-ignore
  // busySignalProvider?.add(busySignalID, { onlyForFile: target })

  const outline = await provider.getOutline(editor)
  view.setOutline(outline?.outlineTrees ?? [], editor, Boolean(lineCountIfLarge(editor as TextEditor)))

  // busySignalProvider?.remove(busySignalID)
}

export function setStatus(id: "noEditor" | "noProvider") {
  view?.presentStatus(statuses[id])
}

export { default as config } from "./config.json"
