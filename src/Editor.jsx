import React from 'react'
import { observer, inject } from 'mobx-react'


class Renderer extends React.Component {
  // Contains the renderer & the logic

}


export default class EditorContainer extends React.Component {
  // Contains both Editor & Renderer
  render() {
    <div className="editor-container">
      <textarea />
      <Renderer />
    </div>
  }
}
