# Обработка ввода

Движок обрабатывает пользовательский ввод с помощью предварительно настроенных приёмников. Каждый приёмник входных данных имеет следующие свойства:

Свойство | Описание
--- | ---
Name | ID приёмника ввода. Используется остальными системами движка для ссылки на приёмник.
Always Process | Следует ли обрабатывать входные данные в режиме блокировки входных данных. Например, при воспроизведении фильма.
Keys | Список клавиш (кнопок), активирующих ввод.
Axes | Список осей (например, мышь или аналоговый джойстик геймпада), активирующих ввод.
Swipes | Список свайпов (сенсорный экран), активирующих ввод.

Для конкретных значений см. руководство по вводу Unity: [docs.unity3d.com/Manual/ConventionalGameInput](https://docs.unity3d.com/Manual/ConventionalGameInput.html).

Вы можете настроить встроенные привязки ввода и добавить новые приёмники с помощью контекстного меню `Naninovel -> Configuration -> Input`; доступные параметры см. в [руководстве по конфигурации](/ru/guide/configuration#input).

![Управление вводом](https://i.gyazo.com/2f97539323c9fc36124e286856a36f84.png)

::: tip EXAMPLE
Пример добавления пользовательской вводной привязки для переключения UI инвентаря можно найти в проекте [примера инвентаря на GitHub](https://github.com/Naninovel/Inventory).

В частности, пользовательская привязка "ToggleInventory" используется в выполняемом сценарии [UI/InventoryUI.cs](https://github.com/Naninovel/Inventory/blob/master/Assets/NaninovelInventory/Runtime/UI/InventoryUI.cs#L215). Привязка с таким же именем добавляется через меню конфигурации ввода в разделе Control Scheme.
:::

## Геймпад и клавиатура

Все встроенные функции можно использовать с помощью геймпада или клавиатуры. Вы можете удалить, изменить или добавить привязки горячих клавиш для геймпада/клавиатуры с помощью вышеупомянутого меню редактора привязок.

Встроенными UI также можно пользоваться с помощью геймпада или клавиатуры, без использования мыши или сенсорного ввода. Находясь в любом из модальных меню (вне основного режима игры, например, главного меню, бэклога и т. д.), нажмите навигационную клавишу (клавиша направления или левый джойстик на геймпаде, клавиши со стрелками на клавиатуре), чтобы выбрать кнопку в меню. Первая выбранная кнопка (игровой объект) может быть изменена в каждом UI с помощью поля `Focus Object`.

![](https://i.gyazo.com/809d4c423d1696a075d5fb73370d48fa.png)

С помощью свойства `Focus Mode` вы можете указать, следует ли фокусироваться на назначенном игровом объекте сразу после того, как UI станет видимым, или после нажатия навигационной клавиши.

::: warning
Навигация геймпадом по UI будет работать только тогда, когда в проекте будет установлена новая система ввода Unity; более подробную информацию о системе ввода вы найдете ниже.
:::

Находясь в основном игровом режиме (вне модальных UI), нажмите кнопку, привязанную к вводу `Pause` (клавиша `Backspace` для клавиатуры и кнопка `Start` для геймпада по умолчанию), чтобы открыть меню паузы, где вы можете сохранить/загрузить игру, открыть настройки, выйти в главное меню и т. д.

## Система ввода

Naninovel поддерживает новую [систему ввода Unity](https://blogs.unity3d.com/2019/10/14/introducing-the-new-input-system/); см. в [официальной документации](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/Installation.html), как установить и включить систему ввода. Когда пакет системы ввода будет установлен (не забудьте включить новый бэкэнд ввода в настройках плеера), в меню конфигурации ввода появится свойство `Input Actions`.

![](https://i.gyazo.com/7c6d767c0f3443e1999fe14917080eb1.png)

Назначьте [ассет вводных действий](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/ActionAssets.html?q=input%20actions%20asset) свойству, затем создайте карту действий "Naninovel" и добавьте вводные действия с именами, равными именам привязкок Naninovel. Список встроенных имен привязок можно найти в списке "Bindings" в разделе "Control Scheme" в том же окне конфигурации. Ниже приведен пример конфигурации вводных действий.

![](https://i.gyazo.com/36d1951519e4f671509c7136a83d9958.png)

При правильной настройке вводные действия активируют привязки Naninovel. Если вы хотите отключить устаревшую обработку вводных данных (которая задана в списке "Bindings"), отключите свойство `Process Legacy Bindings` в меню конфигурации ввода.

::: warning
Сенсорный и объектный вводы по-прежнему обрабатываются с помощью устаревшего ввода, поэтому не отключайте полностью устаревший бэкэнд в настройках плеера, если только вы не собираетесь реализовать эти функции самостоятельно.
:::

Стандартный ассет вводных действий хранится в `Naninovel/Prefabs/DefaultControls.inputactions`.

Для получения дополнительной информации об использовании новой системы ввода (например, как настроить определенные привязки или разрешить игрокам переопределять привязки во время выполнения) обратитесь к [официальному руководству](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual).
