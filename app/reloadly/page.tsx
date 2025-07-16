export default function ReloadlyClientPage()  {
return (
<div
        dangerouslySetInnerHTML={{
          __html: `
            <reloadly-widget data-widget-id="Wb7OEupq5frK7xVWNNCqX7FbUcd6ZNdGAZFSzurdPY"></reloadly-widget>
            <script src="https://cdn.reloadly.com/widget/v2/reloadly-widget.js" async></script>
          `,
        }}
      />
    )}