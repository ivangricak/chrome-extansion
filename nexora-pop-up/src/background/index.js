console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})


// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'myMenu',
//     title: 'Моє меню',
//     contexts: ['selection'],
//   })
// })

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'myMenu') {
//     console.log('Selected text:', info.selectionText)
//   }
// })

chrome.contextMenus.create({
  id: "save-item",
  title: "Save item",
  contexts: ["all"]
});