import type { OntoExplorerState } from './OntoExplorerState'

/**
 * Class that saves states of the explorer and helps navigating through the history.
 */
export class OntoExplorerHistory {
  private history: OntoExplorerState[] = []

  /**
   * Creates the history. Requires a first state.
   * @param firstState the first state when history is created
   */
  constructor(firstState: OntoExplorerState) {
    this.history.push(firstState)
  }

  /**
   * Lets you go back in the history
   * @returns previous state in history
   */
  public goBack(): OntoExplorerState | undefined {
    if (this.history.length > 1)
      return this.history.pop()
    else
      return this.history[0]
  }

  /**
   * Adds a new state to the history.
   * @param newState the new state added to the history
   */
  public stepForward(newState: OntoExplorerState): void {
    this.history.push(newState)
  }
}
