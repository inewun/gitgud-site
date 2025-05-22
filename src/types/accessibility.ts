/**
 * Типизированные интерфейсы для ARIA атрибутов
 * Используются для обеспечения типобезопасности при работе с атрибутами доступности
 */

/**
 * Базовые ARIA атрибуты, которые могут быть применены к любому компоненту
 */
export interface AriaAttributes {
  /** Определяет читаемую вслух метку для элемента */
  'aria-label'?: string;
  /** Ссылается на элемент(ы), описывающие текущий элемент */
  'aria-describedby'?: string;
  /** Указывает, что элемент является текущим активным элементом */
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  /** Указывает, содержит ли элемент или другой связанный элемент ошибку */
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  /** Указывает элемент, который определяет текущий объект */
  'aria-labelledby'?: string;
  /** Указывает, требуется ли ввод данных пользователем */
  'aria-required'?: boolean;
  /** Определяет, что элемент является контейнером для регионов живого содержимого */
  'aria-live'?: 'off' | 'assertive' | 'polite';
  /** Указывает на видимость или скрытость элемента от всех пользователей */
  'aria-hidden'?: boolean;
  /** Определяет текущее состояние чекбокса, радиокнопки и т.д. */
  'aria-checked'?: boolean | 'mixed';
  /** Определяет текущее состояние расширения элемента */
  'aria-expanded'?: boolean;
  /** Указывает, что элемент имеет связанное всплывающее меню */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** Определяет, выбран ли элемент в списке вариантов */
  'aria-selected'?: boolean;
  /** Определяет, что пользователь может изменять значение элемента */
  'aria-readonly'?: boolean;
  /** Определяет, какой уровень занятости должен быть представлен пользователю */
  'aria-busy'?: boolean;
  /** Определяет управляемый элемент */
  'aria-controls'?: string;
  /** Определяет элемент, который является подсказкой для элемента ввода */
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  /** Определяет, является ли элемент disabled или нет */
  'aria-disabled'?: boolean;
  /** Определяет ошибки валидации, связанные с элементом */
  'aria-errormessage'?: string;
}

/**
 * Расширенные ARIA атрибуты для чекбоксов и подобных элементов ввода
 */
export interface AriaCheckboxAttributes extends AriaAttributes {
  /** Определяет состояние чекбокса */
  'aria-checked': boolean | 'mixed';
}

/**
 * Расширенные ARIA атрибуты для кнопок
 */
export interface AriaButtonAttributes extends AriaAttributes {
  /** Определяет нажатое состояние кнопки-переключателя */
  'aria-pressed'?: boolean | 'mixed';
  /** Определяет расширенное состояние для элементов с всплывающим содержимым */
  'aria-expanded'?: boolean;
}

/**
 * Расширенные ARIA атрибуты для списков и выпадающих меню
 */
export interface AriaListAttributes extends AriaAttributes {
  /** Определяет индекс активного элемента в списке или меню */
  'aria-activedescendant'?: string;
  /** Определяет несколько выбранных элементов в списке */
  'aria-multiselectable'?: boolean;
}
