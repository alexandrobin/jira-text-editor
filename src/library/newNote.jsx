import React from 'react'
import { observer, inject } from 'mobx-react'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'


const NewNoteText = `h1. New Note


h2. H2 Title
h3. H3 Title
h4. H4 Title
h5. H5 Title
h6. H6 Title

Superscript : ^I'm up here !^
Subscript ~Look down !~
{{monospaced}}

{quote}
    Would be cool if I could preview my stories :D
{quote}

{color:red}
    look ma, red text!
{color}

|| Table ||
|table|

If you want to send some Pull Requests: [GitHub | https: //github.com/alexandrobin/jira-text-editor]
:) :D :P (y)
----
+Fixed+ :
* 13/08/18:
** *bold* inside *bullet* points
** padding inside the renderer

Known issues :
* Link to username (WIP)
* Anchor not supported yet
* Sublists not supported (#*)
* Formatted block not supported (bq.)
* -Bold text with bullet points-
* -Too much padding between elements- `
@inject(({ session, note }) => ({ session, note }))
@observer
export default class NewNote extends React.Component {
    newNote = () => {
      this.props.note.updateNote({ value: NewNoteText, title: '' })
      this.props.session.updateSession({ savedNote: false })
    }

    render() {
      return (
        <React.Fragment>
          <Button onClick={this.newNote} variant="fab" color="secondary" aria-label="Edit" className="new-button">
            <Icon>
                edit_icon
            </Icon>
          </Button>
        </React.Fragment>
      )
    }
}
