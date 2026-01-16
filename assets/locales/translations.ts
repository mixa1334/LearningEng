export const translations = {
  en: {
    // language / locale
    language: "Language",
    language_title: "English language",
    language_description: "Select the language you want to use",
    language_english_label: "English",
    language_russian_label: "Russian",

    // app / general
    app_name: "LearningEng",

    // loading / bootstrap
    loading_title: "Learn English",
    loading_tagline: "Expand your vocabulary every day",
    loading_preparing: "Preparing your learning journey...",

    // common confirmations / alerts
    common_action_permanent_title: "ACTION IS PERMANENT",

    // generic value picker
    value_picker_select_title: "Select {{entityTitle}}",
    value_picker_close_accessibility: "Close {{entityTitle}} picker",

    // goal overlay
    goal_overlay_body: "You have achieved your daily learning goal!",
    goal_overlay_footer: "You did it! You're amazing!",

    // settings
    settings_title: "Settings",
    settings_dark_theme: "Dark Theme",
    settings_backup_button: "Backup",
    settings_restore_button: "Restore",
    settings_backup_failed_title: "Backup failed",
    settings_backup_failed_message: "Could not create backup file. Please try again.",
    settings_restore_completed_title: "Restore completed",
    settings_restore_completed_message: "Your data has been restored successfully.",
    settings_restore_failed_title: "Restore failed",
    settings_restore_failed_message: "Could not restore from the selected file.",

    // reset card
    reset_title: "Reset",
    reset_user_data_confirm_message: "Are you sure you want to reset your entire user data & statistics?",
    reset_user_data_success: "User data & statistics have been reset successfully.",
    reset_user_data_button: "Reset user data & statistics",
    reset_vocabulary_stats_confirm_message: "Are you sure you want to reset your entire vocabulary statistics?",
    reset_vocabulary_stats_success: "User vocabulary statistics have been reset successfully.",
    reset_vocabulary_stats_button: "Reset vocabulary statistics",
    reset_remove_vocabulary_confirm_message:
      "Are you sure you want to REMOVE your entire VOCABULARY (all words & categories)?",
    reset_remove_vocabulary_success: "User vocabulary (words & categories) has been removed successfully.",
    reset_remove_vocabulary_button: "Remove user words & categories",

    // profile / header
    profile_streak_text: "{{count}} days in a row",

    // profile / daily goal
    profile_daily_goal_title: "Daily goal",
    profile_daily_goal_value: "{{count}} words / day",

    // profile / progress
    profile_progress_title: "Progress",
    profile_progress_last_learning: "Last learning",
    profile_progress_learned_today: "Learned today",
    profile_progress_reviewed_today: "Reviewed today",

    // profile / quote
    profile_quote_error_generic: "Unable to load quote",
    profile_quote_error_title: "Error loading quote",
    profile_quote_today_label: "Today&apos;s thought",

    // profile / FAQ
    faq_title: "FAQ",
    faq_personal_dashboard_title: "Personal dashboard",
    faq_personal_dashboard_body:
      "See your streak, daily goal, overall progress, and a motivational quote on the profile screen so you always know how you are doing.",
    faq_daily_learning_title: "Daily learning & review",
    faq_daily_learning_body:
      "Get a fresh set of words to learn and review every day on the Learn tab, and practice more with quick review, word‑pairs, and build‑the‑word training modes.",
    faq_vocabulary_title: "Vocabulary & categories",
    faq_vocabulary_body:
      "Create your own categories with icons, add new words at any time, and manage a personal dictionary that tracks your learning progress.",
    faq_translation_title: "Translation & history",
    faq_translation_body:
      "Translate words English ↔ Russian, keep a searchable history of your lookups, clear it when you want, and save useful translations straight into your vocabulary with a chosen category.",
    faq_backup_title: "Backup & restore",
    faq_backup_body:
      "From Settings you can export all your data (goals, vocabulary, categories, and translations) to a backup file and restore it later if you switch or reset devices.",
    faq_theme_title: "Theme & data reset",
    faq_theme_body:
      "Switch between light and dark themes, reset statistics, or reset vocabulary progress from the Settings dialog when you want a fresh start.",

    // learning main
    learn_tab_label: "Learn",
    review_tab_label: "Review",
    learn_accept_label: "I know",
    review_accept_label: "I remember",
    learn_reject_label: "Start learn",
    review_reject_label: "Show late",
    learn_complete_message: "You&apos;ve completed daily set!",
    review_no_words_message: "No words to review, come back later!",
    learn_load_more_words_button: "Load more words",

    // learning error state
    learn_error_message: "Error: {{error}}",
    learn_retry_button: "Retry",

    // word card
    word_show_translation: "Show translation",
    word_continue_button: "Continue",

    // practice main / modes
    practice_overview_title: "Review",
    practice_overview_description: "Review your vocabulary words one by one and mark the ones you know",
    practice_pairs_title: "Pairs",
    practice_pairs_description: "Match each Russian word with its English translation",
    practice_builder_title: "Builder",
    practice_builder_description: "Build the English word by picking letters in the correct order",
    practice_header_session: "{{mode}} session",
    practice_end_button: "End",
    practice_start_button: "Start",

    // practice settings
    practice_label_only_user_words: "Only user words",
    practice_label_word_limit: "Word limit",
    practice_label_category: "Category",
    practice_limit_title: "practice limit",
    practice_limit_description: "Choose a practice limit for each practice session (1 session = 1 set of words)",
    practice_reset_criteria_accessibility: "Reset criteria",

    // practice wrapper / generic
    practice_no_words_message: "No words to practice",
    practice_start_over_button: "Start over",
    practice_continue_button: "Continue",

    // practice: building from chars
    practice_builder_ru_label: "RU word",
    practice_builder_end_message: "You solved {{correct}} / {{total}} words without mistakes",

    // practice: match pairs
    practice_pairs_ru_label: "RU words",
    practice_pairs_en_label: "EN words",
    practice_pairs_end_message: "You made {{mistakes}} mistakes while solving {{total}} pairs",

    // practice: quick overview
    practice_quick_overview_accept: "Know",
    practice_quick_overview_reject: "Don&apos;t know",
    practice_quick_overview_end_message:
      "You remembered {{accepted}} of {{totalReviewed}} words ({{percentage}}%)",

    // vocabulary common
    vocabulary_header_title: "Vocabulary",
    vocabulary_tab_title: "Vocabulary",

    // vocabulary index cards
    vocabulary_index_categories_title: "Categories",
    vocabulary_index_categories_description: "Manage your categories! Create, edit, remove!",
    vocabulary_index_words_title: "Words",
    vocabulary_index_words_description: "Manage your words! Create, edit, remove!",
    vocabulary_index_translation_title: "Translation",
    vocabulary_index_translation_description: "Translate words freely between English and Russian!",

    // vocabulary pages / headers
    vocabulary_words_header_title: "Words",
    vocabulary_categories_header_title: "Categories",
    vocabulary_translation_header_title: "Translation",

    // vocabulary search / filters
    vocabulary_clear_search_accessibility: "Clear search",
    vocabulary_search_placeholder: "Search text...",

    // vocabulary categories list / dialogs
    vocabulary_edit_category_title: "Edit category",
    vocabulary_edit_category_name_label: "Category name",
    vocabulary_delete_category_confirm_message: "Are you sure you want to delete this category?",
    vocabulary_edit_category_delete_button: "Delete",
    vocabulary_edit_category_update_button: "Update",

    // vocabulary pickers
    vocabulary_category_default_label: "Category",
    vocabulary_category_picker_title: "category",
    vocabulary_category_picker_description: "Choose a category to assign. You can change it later.",

    // vocabulary word dialogs
    vocabulary_edit_word_title: "Edit word",
    vocabulary_edit_word_subtitle: "Tap a field to quickly update any part of the word.",
    vocabulary_delete_word_confirm_message: "Are you sure you want to delete this word?",
    vocabulary_edit_word_delete_button: "Delete",
    vocabulary_edit_word_update_button: "Update",
    vocabulary_english_word_label: "English word",
    vocabulary_russian_word_label: "Russian word",
    vocabulary_text_example_label: "Text example (optional)",

    // vocabulary create word
    vocabulary_create_word_subtitle: "Fill in the details of your new vocabulary item.",
    vocabulary_create_word_save_button: "Save",

    // vocabulary create category
    vocabulary_create_category_subtitle: "Group your words with a name and emoji for quick scanning.",
    vocabulary_create_category_name_label: "Category name",
    vocabulary_create_category_save_button: "Save",

    // vocabulary save translation page
    vocabulary_save_translation_subtitle:
      "Choose a category for this translation and save it to your vocabulary.",
    vocabulary_save_translation_section_label: "Category",
    vocabulary_save_translation_save_button: "Save",

    // translation screen
    translation_error_unknown: "Unknown error",
    translation_card_title_en_ru: "English \u2192 Russian",
    translation_card_title_ru_en: "Russian \u2192 English",
    translation_placeholder_en: "Enter English word",
    translation_placeholder_ru: "Enter Russian word",
    translation_switch_accessibility: "Switch Languages",
    translation_translate_button: "Translate",
    translation_clear_history_accessibility: "Clear history",
    translation_add_to_vocabulary_accessibility: "Add to vocabulary",

    // app tab titles
    tabs_learn_title: "Learn & Review Words",
    tabs_profile_title: "Profile",

    // vocabulary stack / navigation
    nav_back_title: "Back",
    nav_back_accessibility: "Back",
    nav_create_accessibility: "Create",
    nav_translation_title: "Translation",
    nav_words_title: "Words",
    nav_categories_title: "Categories",
    nav_create_category_title: "Create Category",
    nav_create_word_title: "Create Word",
    nav_save_translation_title: "Save to Vocabulary",
  },

  ru: {
    // language / locale
    language: "Язык",
    language_title: "Русский язык",
    language_description: "Выберите язык, который вы хотите использовать",
    language_english_label: "Английский",
    language_russian_label: "Русский",

    // app / general
    app_name: "LearningEng",

    // loading / bootstrap
    loading_title: "Изучайте английский",
    loading_tagline: "Расширяйте свой словарный запас каждый день",
    loading_preparing: "Подготавливаем ваше обучение...",

    // common confirmations / alerts
    common_action_permanent_title: "ДЕЙСТВИЕ НЕОБРАТИМО",

    // generic value picker
    value_picker_select_title: "Выберите {{entityTitle}}",
    value_picker_close_accessibility: "Закрыть окно выбора ({{entityTitle}})",

    // goal overlay
    goal_overlay_body: "Вы достигли своей ежедневной цели по обучению!",
    goal_overlay_footer: "Отличная работа! Вы молодец!",

    // settings
    settings_title: "Настройки",
    settings_dark_theme: "Тёмная тема",
    settings_backup_button: "Резервная копия",
    settings_restore_button: "Восстановить",
    settings_backup_failed_title: "Не удалось создать копию",
    settings_backup_failed_message: "Не удалось создать файл резервной копии. Пожалуйста, попробуйте ещё раз.",
    settings_restore_completed_title: "Восстановление завершено",
    settings_restore_completed_message: "Ваши данные были успешно восстановлены.",
    settings_restore_failed_title: "Не удалось восстановить",
    settings_restore_failed_message: "Не удалось восстановить данные из выбранного файла.",

    // reset card
    reset_title: "Сброс",
    reset_user_data_confirm_message:
      "Вы уверены, что хотите сбросить все пользовательские данные и статистику?",
    reset_user_data_success: "Пользовательские данные и статистика успешно сброшены.",
    reset_user_data_button: "Сбросить данные и статистику",
    reset_vocabulary_stats_confirm_message:
      "Вы уверены, что хотите сбросить всю статистику по словарю?",
    reset_vocabulary_stats_success: "Статистика словаря успешно сброшена.",
    reset_vocabulary_stats_button: "Сбросить статистику словаря",
    reset_remove_vocabulary_confirm_message:
      "Вы уверены, что хотите УДАЛИТЬ весь словарь (все слова и категории)?",
    reset_remove_vocabulary_success: "Словарь пользователя (слова и категории) был успешно удалён.",
    reset_remove_vocabulary_button: "Удалить слова и категории",

    // profile / header
    profile_streak_text: "{{count}} дней подряд",

    // profile / daily goal
    profile_daily_goal_title: "Ежедневная цель",
    profile_daily_goal_value: "{{count}} слов в день",

    // profile / progress
    profile_progress_title: "Прогресс",
    profile_progress_last_learning: "Последнее обучение",
    profile_progress_learned_today: "Выучено сегодня",
    profile_progress_reviewed_today: "Повторено сегодня",

    // profile / quote
    profile_quote_error_generic: "Не удалось загрузить цитату",
    profile_quote_error_title: "Ошибка загрузки цитаты",
    profile_quote_today_label: "Мысль дня",

    // profile / FAQ
    faq_title: "FAQ",
    faq_personal_dashboard_title: "Персональная панель",
    faq_personal_dashboard_body:
      "Смотрите свою серию, ежедневную цель, общий прогресс и мотивирующую цитату на экране профиля, чтобы всегда знать, как идут дела.",
    faq_daily_learning_title: "Ежедневное обучение и повторение",
    faq_daily_learning_body:
      "Получайте новый набор слов для изучения и повторения каждый день на вкладке \"Learn\" и тренируйтесь больше в режимах быстрого обзора, пар слов и сборки слова.",
    faq_vocabulary_title: "Словарь и категории",
    faq_vocabulary_body:
      "Создавайте собственные категории с иконками, добавляйте новые слова в любое время и ведите личный словарь с отслеживанием прогресса.",
    faq_translation_title: "Перевод и история",
    faq_translation_body:
      "Переводите слова Английский ↔ Русский, ведите историю запросов, очищайте её при необходимости и сохраняйте полезные переводы прямо в свой словарь с выбранной категорией.",
    faq_backup_title: "Резервная копия и восстановление",
    faq_backup_body:
      "В настройках вы можете экспортировать все данные (цели, словарь, категории и переводы) в файл резервной копии и восстановить их позже при смене или сбросе устройства.",
    faq_theme_title: "Тема и сброс данных",
    faq_theme_body:
      "Переключайтесь между светлой и тёмной темами, сбрасывайте статистику или прогресс словаря в настройках, когда хотите начать заново.",

    // learning main
    learn_tab_label: "Изучение",
    review_tab_label: "Повторение",
    learn_accept_label: "Я знаю",
    review_accept_label: "Я помню",
    learn_reject_label: "Начать изучать",
    review_reject_label: "Показать позже",
    learn_complete_message: "Вы выполнили дневной набор слов!",
    review_no_words_message: "Нет слов для повторения, загляните позже!",
    learn_load_more_words_button: "Загрузить больше слов",

    // learning error state
    learn_error_message: "Ошибка: {{error}}",
    learn_retry_button: "Повторить",

    // word card
    word_show_translation: "Показать перевод",
    word_continue_button: "Продолжить",

    // practice main / modes
    practice_overview_title: "Обзор",
    practice_overview_description:
      "Просматривайте слова из словаря по одному и отмечайте те, которые вы знаете",
    practice_pairs_title: "Пары",
    practice_pairs_description: "Сопоставляйте каждое русское слово с его английским переводом",
    practice_builder_title: "Конструктор",
    practice_builder_description: "Собирайте английское слово, выбирая буквы в правильном порядке",
    practice_header_session: "Сессия: {{mode}}",
    practice_end_button: "Завершить",
    practice_start_button: "Начать",

    // practice settings
    practice_label_only_user_words: "Только пользовательские слова",
    practice_label_word_limit: "Лимит слов",
    practice_label_category: "Категория",
    practice_limit_title: "лимит практики",
    practice_limit_description:
      "Выберите лимит слов для каждой практической сессии (1 сессия = 1 набор слов)",
    practice_reset_criteria_accessibility: "Сбросить критерии",

    // practice wrapper / generic
    practice_no_words_message: "Нет слов для практики",
    practice_start_over_button: "Начать заново",
    practice_continue_button: "Продолжить",

    // practice: building from chars
    practice_builder_ru_label: "Русское слово",
    practice_builder_end_message:
      "Вы собрали {{correct}} из {{total}} слов без ошибок",

    // practice: match pairs
    practice_pairs_ru_label: "RU слова",
    practice_pairs_en_label: "EN слова",
    practice_pairs_end_message:
      "Вы допустили {{mistakes}} ошибок при решении {{total}} пар",

    // practice: quick overview
    practice_quick_overview_accept: "Знаю",
    practice_quick_overview_reject: "Не знаю",
    practice_quick_overview_end_message:
      "Вы запомнили {{accepted}} из {{totalReviewed}} слов ({{percentage}}%)",

    // vocabulary common
    vocabulary_header_title: "Словарь",
    vocabulary_tab_title: "Словарь",

    // vocabulary index cards
    vocabulary_index_categories_title: "Категории",
    vocabulary_index_categories_description: "Управляйте своими категориями: создавайте, редактируйте, удаляйте!",
    vocabulary_index_words_title: "Слова",
    vocabulary_index_words_description: "Управляйте своими словами: создавайте, редактируйте, удаляйте!",
    vocabulary_index_translation_title: "Перевод",
    vocabulary_index_translation_description:
      "Переводите слова между английским и русским как вам удобно!",

    // vocabulary pages / headers
    vocabulary_words_header_title: "Слова",
    vocabulary_categories_header_title: "Категории",
    vocabulary_translation_header_title: "Перевод",

    // vocabulary search / filters
    vocabulary_clear_search_accessibility: "Очистить поиск",
    vocabulary_search_placeholder: "Поиск...",

    // vocabulary categories list / dialogs
    vocabulary_edit_category_title: "Редактировать категорию",
    vocabulary_edit_category_name_label: "Название категории",
    vocabulary_delete_category_confirm_message:
      "Вы уверены, что хотите удалить эту категорию?",
    vocabulary_edit_category_delete_button: "Удалить",
    vocabulary_edit_category_update_button: "Обновить",

    // vocabulary pickers
    vocabulary_category_default_label: "Категория",
    vocabulary_category_picker_title: "категорию",
    vocabulary_category_picker_description:
      "Выберите категорию для привязки. Вы сможете изменить её позже.",

    // vocabulary word dialogs
    vocabulary_edit_word_title: "Редактировать слово",
    vocabulary_edit_word_subtitle:
      "Нажмите на поле, чтобы быстро обновить любую часть слова.",
    vocabulary_delete_word_confirm_message:
      "Вы уверены, что хотите удалить это слово?",
    vocabulary_edit_word_delete_button: "Удалить",
    vocabulary_edit_word_update_button: "Обновить",
    vocabulary_english_word_label: "Английское слово",
    vocabulary_russian_word_label: "Русское слово",
    vocabulary_text_example_label: "Текстовый пример (необязательно)",

    // vocabulary create word
    vocabulary_create_word_subtitle:
      "Заполните данные для нового слова в вашем словаре.",
    vocabulary_create_word_save_button: "Сохранить",

    // vocabulary create category
    vocabulary_create_category_subtitle:
      "Сгруппируйте слова с помощью названия и эмодзи для быстрого просмотра.",
    vocabulary_create_category_name_label: "Название категории",
    vocabulary_create_category_save_button: "Сохранить",

    // vocabulary save translation page
    vocabulary_save_translation_subtitle:
      "Выберите категорию для этого перевода и сохраните его в словарь.",
    vocabulary_save_translation_section_label: "Категория",
    vocabulary_save_translation_save_button: "Сохранить",

    // translation screen
    translation_error_unknown: "Неизвестная ошибка",
    translation_card_title_en_ru: "Английский \u2192 Русский",
    translation_card_title_ru_en: "Русский \u2192 Английский",
    translation_placeholder_en: "Введите английское слово",
    translation_placeholder_ru: "Введите русское слово",
    translation_switch_accessibility: "Поменять языки местами",
    translation_translate_button: "Перевести",
    translation_clear_history_accessibility: "Очистить историю",
    translation_add_to_vocabulary_accessibility: "Добавить в словарь",

    // app tab titles
    tabs_learn_title: "Изучение и повторение",
    tabs_profile_title: "Профиль",

    // vocabulary stack / navigation
    nav_back_title: "Назад",
    nav_back_accessibility: "Назад",
    nav_create_accessibility: "Создать",
    nav_translation_title: "Перевод",
    nav_words_title: "Слова",
    nav_categories_title: "Категории",
    nav_create_category_title: "Создать категорию",
    nav_create_word_title: "Создать слово",
    nav_save_translation_title: "Сохранить в словарь",
  },
};
