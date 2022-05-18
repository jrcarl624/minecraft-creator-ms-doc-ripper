

(?<image>(\!)(\[(?:.*)?\])(\(.*(\.(jpg|png|gif|tiff|bmp))(?:(\s\"|\')(\w|\W|\d)+(\"|\'))?\)))
(?<alert>(>\s\[!(NOTE|TIP|CAUTION|WARNING|IMPORTANT)\])\s((^(\>{1})(.*)(?:$)?)+))(?<list>^(\s*)(?:(?:\d+\. )|(?:- )|(?:\* ))(?:.*))(?<checklist>> [\[!div class="checklist"\]]+\n|(^(?:\s*)(?:(?:> \* )(?:.*))))


---
title: Markdown reference for docs.microsoft.com
description: Learn the Markdown features and syntax used in the Microsoft Docs platform.
author: meganbradley
ms.author: mbradley
ms.date: 11/09/2021
ms.topic: contributor-guide
ms.prod: non-product-specific
ms.custom: external-contributor-guide
------

- -----

---# Docs Markdown reference
## Alerts (Note, Tip, Important, Caution, Warning)
```md
> [!NOTE]
> Information the user should notice even if skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Essential information required for user success.

> [!CAUTION]
> Negative potential consequences of an action.

> [!WARNING]
> Dangerous certain consequences of an action.
```> [!NOTE]
> Information the user should notice even if skimming.
> [!TIP]
> Optional information to help a user be more successful.
> [!IMPORTANT]
> Essential information required for user success.
> [!CAUTION]
> Negative potential consequences of an action.
> [!WARNING]
> Dangerous certain consequences of an action.
## Angle brackets
## Apostrophes and quotation marks
> [!TIP]
> To avoid "smart" characters in your Markdown files, rely on the Docs Authoring Pack's smart quote replacement feature. For more information, see [smart quote replacement](docs-authoring/smart-quote-replacement.md).
## Blockquotes
> This is a blockquote. It is usually rendered indented and with a different background color.
> This is a blockquote. It is usually rendered indented and with a different background color.
## Bold and italic text
```md
This text is **bold**.
``````md
This text is *italic*.
``````md
This text is both ***bold and italic***.
```## Code snippets
## Columns
```md
:::row:::
   :::column span="":::
      Content...
   :::column-end:::
   :::column span="":::
      More content...
   :::column-end:::
:::row-end:::
``````md
:::row:::
   :::column span="2":::
      **This is a 2-span column with lots of text.**

      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum mollis nunc
      ornare commodo. Nullam ac metus imperdiet, rutrum justo vel, vulputate leo. Donec
      rutrum non eros eget consectetur.
   :::column-end:::
   :::column span="":::
      **This is a single-span column with an image in it.**

      ![Doc.U.Ment](media/markdown-reference/document.png)
   :::column-end:::
:::row-end:::
```:::row:::
   :::column span="2":::
      **This is a 2-span column with lots of text.**

      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum mollis nunc
      ornare commodo. Nullam ac metus imperdiet, rutrum justo vel, vulputate leo. Donec
      rutrum non eros eget consectetur.
   :::column-end:::
   :::column span="":::
      **This is a single-span column with an image in it.**

      ![Doc.U.Ment](media/markdown-reference/document.png)
   :::column-end:::
:::row-end:::## Comments
<!--- Here's my comment --->> [!WARNING]
> Do not put private or sensitive information in HTML comments. Docs carries HTML comments through to the published HTML that goes public. While HTML comments are invisible to the reader's eye, they are exposed in the HTML underneath.
## Headings
```md
# This is a first level heading (H1)

## This is a second level heading (H2)

...

###### This is a sixth level heading (H6)
```## HTML
## Images
```md
"resource": [
  {
    "files" : [
      "**/*.png",
      "**/*.jpg,
      "**/*.gif"
    ],
```### Standard conceptual images (default Markdown)
```Markdown
![<alt text>](<folderPath>)

Example:
![alt text for image](../images/Introduction.png)
``````md
![ADextension_2FA_Configure_Step4](./media/bogusfilename/ADextension_2FA_Configure_Step4.PNG)
``````md
![Active Directory extension for two-factor authentication, step 4: Configure](./media/bogusfilename/ADextension_2FA_Configure_Step4.PNG)
```### Standard conceptual images (Docs Markdown)
```md
:::image type="content" source="<folderPath>" alt-text="<alt text>":::
```### Complex images with long descriptions
:::image type="complex" source="<folderPath>" alt-text="<alt text>":::
   <long description here>
:::image-end::::::image type="content" source="media/markdown-reference/long-description.png" alt-text="Screenshot of the HTML for an image and its long description.":::### Automatic borders
<!-- This section can be allowed publicly, but there's no external guide article for how to use lightboxes, so we can't add it until we have an external-guide equivalent.

### Creating an expandable image

The optional `lightbox` property allows you to create an expanded image, as described in [Create an expandable screenshot (lightbox)](contribute-how-to-use-lightboxes.md). The value of `lightbox` is the path to the expanded image.

-->### Specifying loc-scope
### Icons
```md
:::image type="icon" source="<folderPath>":::
```<!-- No lightbox article in external guide, so commenting this out for now.

The `lightbox` property works the same for `icon` images as for standard `content` images.

-->## Included Markdown files
### Includes syntax
```md
[!INCLUDE [<title>](<filepath>)]
``````md
Text before [!INCLUDE [<title>](<filepath>)] and after.
```## Indentation
  > [!TIP]
  > This tip is indented two spaces
  - This is a second-level bullet (indented two spaces, with one space after the bullet before the letter T).
    This sentence is indented four spaces.
    > This quote block is indented four spaces.
   ```
   This code block is indented three spaces.
   ```
  > [!TIP]
  > This tip is indented two spaces.
  - This is a second-level bullet (indented two spaces, with one space after the bullet before the letter T).

    > This quote block is indented four spaces.
## Links
## Lists (Numbered, Bulleted, Checklist)
### Numbered list
```md
1. This is
1. a parent numbered list
   1. and this is
   1. a nested numbered list
1. (fin)
```### Bulleted list
```md
- This is
- a parent bulleted list
  - and this is
  - a nested bulleted list
- All done!
```### Checklist
```md
> [!div class="checklist"]
> * List item 1
> * List item 2
> * List item 3


This example renders on Docs like this:

> [!div class="checklist"]
> * List item 1
> * List item 2
> * List item 3


(?<yamlHeader>^(?:^---\s)(?:.*?)(?:^---)$)|(?<heading>(?:^#{1,6}\s)(?:.*?)\s$)|(?<codeBlock>^(?:[ ]*```)(?:.*?)(?:```)$)|(?<image>(^:::image(?:.*?)image-end:::$)|(^:::image(?:.*?):::$))|(?<comment><!--(?:.*?)-->)|(?<alert>^[ ]*> \[!(?:NOTE|TIP|CAUTION|WARNING|IMPORTANT\])\n[ ]*> .+?$)|(?<quote>^[ ]*> (?:.*?)\n$)|(?<list>^[ ]*(?:\d.|[*+-]) [^]*?(^(?:\d.|[*-])|$))|(?<link>^\[.+?\]\(?:.+?\)\n$)|(?<row>^:::row(?:.*?)row-end:::$)|(?<column>^:::column(?:.*?)column-end:::$)|(?<checklist>^[ ]*> \[!div class="checklist"\]\n[ ]*> \* (?:(.|\n)*?)(?:> \*.+?[\n ])$)


Use checklists at the beginning or end of an article to summarize "What will you learn" or "What have you learned" content. Do not add random checklists throughout your articles.

## Next step action

You can use a custom extension to add a next step action button to Docs pages.

The syntax is as follows:

```markdown
> [!div class="nextstepaction"]
> [button text](link to topic)
``````md
> [!div class="nextstepaction"]
> [Learn about adding code to articles](code-in-docs.md)
```> [!div class="nextstepaction"]
> [Learn about adding code to articles](code-in-docs.md)
## Non-localized strings
```markdown
:::no-loc text="String":::
``````md
# Heading 1 of the Document

Markdown content within the :::no-loc text="Document":::.  The are multiple instances of Document, document, and documents.
```> [!NOTE]
> Use `\` to escape special characters:
> ```markdown
> Lorem :::no-loc text="Find a \"Quotation\""::: Ipsum.
> ```
```yml
author: cillroy
no-loc: [Global, Strings, to be, Ignored]
```> [!NOTE]
> The no-loc metadata is not supported as global metadata in *docfx.json* file. The localization pipeline doesn't read the *docfx.json* file, so the no-loc metadata must be added into each individual source file.
```md
# Heading 1 of the Document

Markdown content within the document.
```<!-- commenting out for now because no one knows what this means
## Section definition

You might need to define a section. This syntax is mostly used for code tables.
See the following example:

````
> [!div class="tabbedCodeSnippets" data-resources="OutlookServices.Calendar"]
> ```cs
> <cs code text>
> ```
> ```javascript
> <js code text>
> ```
````

The preceding blockquote Markdown text will be rendered as:
> [!div class="tabbedCodeSnippets" data-resources="OutlookServices.Calendar"]
> ```cs
> <cs code text>
> ```
> ```javascript
> <js code text>
> ```
-->## Selectors
### Single selector
```md
> [!div class="op_single_selector"]
> - [Universal Windows](../articles/notification-hubs-windows-store-dotnet-get-started/)
> - [Windows Phone](../articles/notification-hubs-windows-phone-get-started/)
> - [iOS](../articles/notification-hubs-ios-get-started/)
> - [Android](../articles/notification-hubs-android-get-started/)
> - [Kindle](../articles/notification-hubs-kindle-get-started/)
> - [Baidu](../articles/notification-hubs-baidu-get-started/)
> - [Xamarin.iOS](../articles/partner-xamarin-notification-hubs-ios-get-started/)
> - [Xamarin.Android](../articles/partner-xamarin-notification-hubs-android-get-started/)
```> [!div class="op_single_selector"]
> - [Universal Windows](how-to-write-links.md)
> - [Windows Phone](how-to-write-links.md)
> - [iOS](how-to-write-links.md)
> - [Android](how-to-write-links.md)
> - [Kindle](how-to-write-links.md)
> - [Baidu](how-to-write-links.md)
> - [Xamarin.iOS](how-to-write-links.md)
> - [Xamarin.Android](how-to-write-links.md)
### Multi-selector
```md
> [!div class="op_multi_selector" title1="Platform" title2="Backend"]
> - [(iOS | .NET)](./mobile-services-dotnet-backend-ios-get-started-push.md)
> - [(iOS | JavaScript)](./mobile-services-javascript-backend-ios-get-started-push.md)
> - [(Windows universal C# | .NET)](./mobile-services-dotnet-backend-windows-universal-dotnet-get-started-push.md)
> - [(Windows universal C# | Javascript)](./mobile-services-javascript-backend-windows-universal-dotnet-get-started-push.md)
> - [(Windows Phone | .NET)](./mobile-services-dotnet-backend-windows-phone-get-started-push.md)
> - [(Windows Phone | Javascript)](./mobile-services-javascript-backend-windows-phone-get-started-push.md)
> - [(Android | .NET)](./mobile-services-dotnet-backend-android-get-started-push.md)
> - [(Android | Javascript)](./mobile-services-javascript-backend-android-get-started-push.md)
> - [(Xamarin iOS | Javascript)](./partner-xamarin-mobile-services-ios-get-started-push.md)
> - [(Xamarin Android | Javascript)](./partner-xamarin-mobile-services-android-get-started-push.md)
```

(?<checklist>^[ ]*> \[!div class="checklist"\]\n[ ]*> \* (?:(.|\n)*?)(?:> \*.+?[\n ])$)


> [!div class="op_multi_selector" title1="Platform" title2="Backend"]
> - [(iOS | .NET)](how-to-write-links.md)
> - [(iOS | JavaScript)](how-to-write-links.md)
> - [(Windows universal C# | .NET)](how-to-write-links.md)
> - [(Windows universal C# | Javascript)](how-to-write-links.md)
> - [(Windows Phone | .NET)](how-to-write-links.md)
> - [(Windows Phone | Javascript)](how-to-write-links.md)
> - [(Android | .NET)](how-to-write-links.md)
> - [(Android | Javascript)](how-to-write-links.md)
> - [(Xamarin iOS | Javascript)](how-to-write-links.md)
> - [(Xamarin Android | Javascript)](how-to-write-links.md)
## Subscript and superscript
```html
Hello <sub>This is subscript!</sub>
``````html
Goodbye <sup>This is superscript!</sup>
```## Tables
```md
|  This is   |  a simple   |       table header|
|----------|-----------|------------|
|table     |data       |here        |
|it doesn't|actually   |have to line up nicely!|
```

|This is   |a simple   |table header|
|----------|-----------|------------|
|table     |data       |here        |
|it doesn't|actually   |have to line up nicely!|
```md
| Fun                  | With                 | Tables          |
| :------------------- | -------------------: |:---------------:|
| left-aligned column  | right-aligned column | centered column |
| $100                 | $100                 | $100            |
| $10                  | $10                  | $10             |
| $1                   | $1                   | $1              |
```

| Fun                  | With                 | Tables          |
| :------------------- | -------------------: |:---------------:|
| left-aligned column  | right-aligned column | centered column |
| $100                 | $100                 | $100            |
| $10                  | $10                  | $10             |
| $1                   | $1                   | $1              |
> [!TIP]
> The Docs Authoring Extension for VS Code makes it easy to add basic Markdown tables!
>
> You can also use an [online table generator](http://www.tablesgenerator.com/markdown_tables).
### Line breaks within words in any table cell
```md
> [!div class="mx-tdBreakAll"]
> |Name|Syntax|Mandatory for silent installation?|Description|
> |-------------|----------|---------|---------|
> |Quiet|/quiet|Yes|Runs the installer, displaying no UI and no prompts.|
> |NoRestart|/norestart|No|Suppresses any attempts to restart. By default, the UI will prompt before restart.|
> |Help|/help|No|Provides help and quick reference. Displays the correct use of the setup command, including a list of all options and behaviors.|
```> [!div class="mx-tdBreakAll"]
> |Name|Syntax|Mandatory for silent installation?|Description|
> |-------------|----------|---------|---------|
> |Quiet|/quiet|Yes|Runs the installer, displaying no UI and no prompts.|
> |NoRestart|/norestart|No|Suppresses any attempts to restart. By default, the UI will prompt before restart.|
> |Help|/help|No|Provides help and quick reference. Displays the correct use of the setup command, including a list of all options and behaviors.|
### Line breaks within words in second column table cells
### Inconsistent column widths between tables
### Data matrix tables
```md
|                  |Header 1 |Header 2|
|------------------|---------|--------|
|**First column A**|Cell 1A  |Cell 2A |
|**First column B**|Cell 1B  |Cell 2B |
```

|                  |Header 1 |Header 2|
|------------------|---------|---|
|**First column A**|Cell 1A  |Cell 2A |
|**First column B**|Cell 1B  |Cell 2B |
> [!TIP]
> The Docs Authoring Pack for VS Code includes a function to convert a regular Markdown table into a data matrix table. Just select the table, right-click, and select **Convert to data matrix table**.
### HTML Tables
