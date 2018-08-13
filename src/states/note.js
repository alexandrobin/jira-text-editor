import { observable, action } from 'mobx'

const WelcomeText = `h1. Welcome to Jira Text Editor

Hi! I'm your first file in *JTE*. If you want to play, you can edit me.
?? JTE ??

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


class StateNote {
  @observable title

  @observable value = WelcomeText

  @action updateNote = (state) => {
    const values = { ...this, ...state }
    this.title = values.title
    this.value = values.value
  }
}

const stateNote = new StateNote()
export default stateNote
