import React, { Component } from 'react';
import {observer, inject} from 'mobx-react';

const WelcomeText = `h1. Welcome to Jira Text Editor

Hi! I'm your first file in *JTE*. If you want to play, you can edit me.

h2. H2 Title
h3. H3 Title
h4. H4 Title
h5. H5 Title
h6. H6 Title

* _Bullet points_
* :) Emojis

*Known issues :*
* Bold text with bullet points
* Too much padding between elements`

class JiraFormatted extends React.Component {

  createList(e, li, pat) {

    for(let i=10; i>0; i--) {
      let p = Array(i+1).join(pat)
      let pn = ""
      if(i>1)
      pn = Array(i).join(pat)

      let re = new RegExp("^[ ]*"+p+"(.*)\n[ ]*"+p,'gm')
      e = e.replace(re,p+"$1\n-li-")

      re = new RegExp("^[ ]*-li-(.*)\n[ ]*"+p,'gm')
      e = e.replace(re,"-li-$1\n-li-")

      e = e.replace(/-li-(.*)$/gm,"-li-$1 -/li- -/"+li+"-")

      re = new RegExp("^[ ]*"+p+"(.*)$",'gm')
      e = e.replace(re,pn+"-"+li+"- -li- $1 -/li- -/"+li+"-")

      re = new RegExp("-\/"+li+"-\n-li-",'gm')
      e = e.replace(re,"\n-li-")
    }


    e = e.replace(/-li-/g, "<li>")
    e = e.replace(/-\/li-/g, "</li>")
    e = e.replace(/-ol-/g, "<ol>")
    e = e.replace(/-\/ol-/g, "</ol>")
    e = e.replace(/-ul-/g, "<ul>")
    e = e.replace(/-\/ul-/g, "</ul>")
    e = e.replace(/<\/li>[ ]*\n[ ]*<li>/g, "</li><li>")
    e = e.replace(/<li>[ ]*\n[ ]*<ol>/g, "<li style='list-style-type: none'><ol>")
    e = e.replace(/<li>[ ]*\n[ ]*<ul>/g, "<li style='list-style-type: none'><ul>")
    e = e.replace(/<\/li><li>[ ]*<ol>/g, "<ol>")
    e = e.replace(/<\/li><li>[ ]*<ul>/g, "<ul>")


    return e
  }


    createSList(e, li, pat) {

      for(let i=10; i>0; i--) {
        let p = Array(i+1).join(pat)
        let pn = ""
        if(i>1)
        pn = Array(i).join(pat)

        let re = new RegExp("^[ ]*"+p+"(.*)\n[ ]*"+p,'gm')
        e = e.replace(re,p+"$1\n-li-")

        re = new RegExp("^[ ]*-li-(.*)\n[ ]*"+p,'gm')
        e = e.replace(re,"-li-$1\n-li-")

        e = e.replace(/-li-(.*)$/gm,"-li-$1 -/li- -/"+li+"-")

        re = new RegExp("^[ ]*"+p+"(.*)$",'gm')
        e = e.replace(re,pn+"-"+li+"- -li- $1 -/li- -/"+li+"-")

        re = new RegExp("-\/"+li+"-\n-li-",'gm')
        e = e.replace(re,"\n-li-")
      }

/*
      e = e.replace(/-li-/g, "<li>")
      e = e.replace(/-\/li-/g, "</li>")
      e = e.replace(/-ol-/g, "<ol>")
      e = e.replace(/-\/ol-/g, "</ol>")
      e = e.replace(/-ul-/g, "<ul>")
      e = e.replace(/-\/ul-/g, "</ul>")
      e = e.replace(/<\/li>[ ]*\n[ ]*<li>/g, "</li><li>")
      e = e.replace(/<li>[ ]*\n[ ]*<ol>/g, "<li style='list-style-type: none'><ol>")
      e = e.replace(/<li>[ ]*\n[ ]*<ul>/g, "<li style='list-style-type: none'><ul>")
      e = e.replace(/<\/li><li>[ ]*<ol>/g, "<ol>")
      e = e.replace(/<\/li><li>[ ]*<ul>/g, "<ul>")
      */

      return e
    }


  compile(e) {

    e = e.replace(/\\\\/g, "<br>");
    e = e.replace(/----/g, "<hr>");
    e = e.replace(/---/g, "<b>&mdash;</b>");
    e = e.replace(/\*\*/g, "<b>-</b>");


    e = e.replace(/^\*([^*\n]+)$/g, "¨$1")
    e = e.replace(/\*([^*\n]+)\*/g, "<b>$1</b>")
    e = e.replace(/\_(.+)\_/g, "<i>$1</i>")
    e = e.replace(/\?\?(.+)\?\?/g, "&mdash; <i>$1</i>")
    e = e.replace(/\-(.+)\- /g, "<strike>$1</strike>")
    e = e.replace(/\ -(.+)\- /g, "<strike>$1</strike>")
    e = e.replace(/\+(.+)\+/g, "<u>$1</u>")
    e = e.replace(/\^(.+)\^/g, "<sup>$1</sup>")
    e = e.replace(/\~(.+)\~/g, "<sub>$1</sub>")
    e = e.replace(/\{\{(.+)\}\}/g, "<span style='font-family: monospace'>$1</span>")
    e = e.replace(/bq\. (.+)/g, "<span class='block'>$1</span>")
    e = e.replace(/\{color:(.+)\}\n?([\S\s]+)\n?\{color\}/gm, "<span style='color:$1'>$2</span>")

    /*
    Notation	:)	:(	:P	:D	;)	(y)	(n)	(i)	(/)	(x)	(!)
    Image
    Notation	(+)	(-)	(?)	(on)	(off)	(*)	(*r)	(*g)	(*b)	(*y)	(flag)
Image
Notation	(flagoff)
Image

    */
    e = e.replace(/\:\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/smile.gif'/>")
    e = e.replace(/\:\(/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/sad.gif'/>")
    e = e.replace(/\:P/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/tongue.gif'/>")
    e = e.replace(/\;\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/biggrin.gif'/>")
    e = e.replace(/\;\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/wink.gif'/>")
    e = e.replace(/\(y\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/thumbs_up.gif'/>")
    e = e.replace(/\(n\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/thumbs_down.gif'/>")
    e = e.replace(/\(i\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/information.gif'/>")
    e = e.replace(/\(\/\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/check.gif'/>")
    e = e.replace(/\(x\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/error.gif'/>")
    e = e.replace(/\(!\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/warning.gif'/>")
    e = e.replace(/\(+\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/add.gif'/>")
    e = e.replace(/\(\-\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/forbidden.gif'/>")
    e = e.replace(/\(\?\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/help_16.gif'/>")
    e = e.replace(/\(on\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/lightbulb_on.gif'/>")
    e = e.replace(/\(off\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/lightbulb.gif'/>")
    e = e.replace(/\(\*\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/star_yellow.gif'/>")
    e = e.replace(/\(\*r\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/star_red.gif'/>")
    e = e.replace(/\(\*g\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/star_green.gif'/>")
    e = e.replace(/\(\*b\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/star_blue.gif'/>")
    e = e.replace(/\(\*y\)/g, "<img src='https://jira.atlassian.com/images/icons/emoticons/star_yellow.gif'/>")




    e = e.replace(/h1\. (.+)/g, "<h1>$1</h1>")
    e = e.replace(/h2\. (.+)/g, "<h2>$1</h2>")
    e = e.replace(/h3\. (.+)/g, "<h3>$1</h3>")
    e = e.replace(/h4\. (.+)/g, "<h4>$1</h4>")
    e = e.replace(/h5\. (.+)/g, "<h5>$1</h5>")
    e = e.replace(/h6\. (.+)/g, "<h6>$1</h6>")

    e = e.replace(/\[(.+)\|(.+)\]/g, "<a href=$2>$1</a>")
    e = e.replace(/\[mailto:(.+)\]/g, "<a href=mailto:$1>$1</a>")
    e = e.replace(/\[(.+)\]/g, "<a href=$1>$1</a>")

    e = e.replace(/\{anchor:.+\}/g, "")

    e = e.replace(/^[ ]*\|\|/gm,"<tr><th>")
    e = e.replace(/\|\|[ ]*$/gm,"</th></tr>")
    e = e.replace(/\|\|/gm,"</th><th>")

    e = e.replace(/^[ ]*\|/gm,"<tr><td>")
    e = e.replace(/\|[ ]*$/gm,"</td></tr>")
    e = e.replace(/\|/gm,"</td><td>")

    e = e.replace(/<\/tr>[ ]*\n[ ]*<tr>/gm, "</tr><tr>")
    e = e.replace(/^[ ]*<tr>/gm, "<table><tr>")
    e = e.replace(/[ ]*<\/tr>$/gm, "</tr></table>")

    e = e.split("{quote}")
    e.map(function(t,i) {
      if(((i)%2)) {
        if(t[0] == "\n")
          t = t.slice(1)
        e[i] = "<span class='block'>"+t+"</span>"
      }
    })
    e = e.join('')

    e = this.createList(e, "ol", '#')
    e = e.replace(/\*/g, "¨")
    e = this.createList(e, "ul", '¨')



    e = e.replace(/\n/g, "<br>");

    return e
  }

  render() {
    let wysiwyg = this.compile(this.props.value)

    return(
      <div className="render" style={{overflow: "auto"}} dangerouslySetInnerHTML={{__html: wysiwyg}}></div>
    )
  }
}

@inject( ({note:{value,updateNote}}) => ({value,updateNote}))
@observer
export default class JiraFormat extends React.Component {

  handleChange = event => {
    this.props.updateNote({value:event.target.value})
  };

  render() {

    return(
      <div className="editor-container">
      <span>
        <textarea ref="area" value={this.props.value} onChange={this.handleChange}>
        </textarea>
        <JiraFormatted value={this.props.value} />
      </span>
      </div>
    )
  }
}
