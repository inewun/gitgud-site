module.exports = function (plop) {
  // Генератор компонента
  plop.setGenerator('component', {
    description: 'Создание нового React компонента',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Какой тип компонента вы хотите создать?',
        choices: ['atom', 'molecule', 'organism'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Имя компонента:',
        validate: value => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Имя компонента обязательно';
        },
      },
      {
        type: 'confirm',
        name: 'withStory',
        message: 'Создать Storybook story?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'withTest',
        message: 'Создать тестовый файл?',
        default: true,
      },
    ],
    actions: data => {
      const basePath = `src/components/${data.type === 'atom' ? 'atoms' : data.type === 'molecule' ? 'molecules' : 'organisms'}`;

      const actions = [
        // Создание компонента
        {
          type: 'add',
          path: `${basePath}/{{pascalCase name}}.tsx`,
          templateFile: 'plop-templates/component.tsx.hbs',
        },
        // Обновление индексного файла для экспорта
        {
          type: 'append',
          path: 'src/components/index.ts',
          pattern: `// ${data.type === 'atom' ? 'Atoms' : data.type === 'molecule' ? 'Molecules' : 'Organisms'}`,
          template: `export { default as {{pascalCase name}} } from './${data.type === 'atom' ? 'atoms' : data.type === 'molecule' ? 'molecules' : 'organisms'}/{{pascalCase name}}';`,
        },
      ];

      // Добавление Storybook story, если выбрано
      if (data.withStory) {
        actions.push({
          type: 'add',
          path: `${basePath}/{{pascalCase name}}.stories.tsx`,
          templateFile: 'plop-templates/component.stories.tsx.hbs',
        });
      }

      // Добавление тестового файла, если выбрано
      if (data.withTest) {
        actions.push({
          type: 'add',
          path: `${basePath}/__tests__/{{pascalCase name}}.test.tsx`,
          templateFile: 'plop-templates/component.test.tsx.hbs',
        });
      }

      return actions;
    },
  });

  // Генератор хука
  plop.setGenerator('hook', {
    description: 'Создание нового React хука',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Имя хука (без префикса "use"):',
        validate: value => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Имя хука обязательно';
        },
      },
      {
        type: 'confirm',
        name: 'withTest',
        message: 'Создать тестовый файл?',
        default: true,
      },
    ],
    actions: data => {
      const actions = [
        // Создание хука
        {
          type: 'add',
          path: 'src/hooks/use{{pascalCase name}}.ts',
          templateFile: 'plop-templates/hook.ts.hbs',
        },
        // Обновление индексного файла для экспорта
        {
          type: 'append',
          path: 'src/hooks/index.ts',
          pattern: /^/,
          template: `export { default as use{{pascalCase name}} } from './use{{pascalCase name}}';`,
        },
      ];

      // Добавление тестового файла, если выбрано
      if (data.withTest) {
        actions.push({
          type: 'add',
          path: 'src/hooks/__tests__/use{{pascalCase name}}.test.ts',
          templateFile: 'plop-templates/hook.test.ts.hbs',
        });
      }

      return actions;
    },
  });

  // Генератор утилиты
  plop.setGenerator('util', {
    description: 'Создание новой утилиты',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Имя утилиты:',
        validate: value => {
          if (/.+/.test(value)) {
            return true;
          }
          return 'Имя утилиты обязательно';
        },
      },
      {
        type: 'confirm',
        name: 'withTest',
        message: 'Создать тестовый файл?',
        default: true,
      },
    ],
    actions: data => {
      const actions = [
        // Создание утилиты
        {
          type: 'add',
          path: 'src/lib/{{camelCase name}}.ts',
          templateFile: 'plop-templates/util.ts.hbs',
        },
      ];

      // Добавление тестового файла, если выбрано
      if (data.withTest) {
        actions.push({
          type: 'add',
          path: 'src/lib/__tests__/{{camelCase name}}.test.ts',
          templateFile: 'plop-templates/util.test.ts.hbs',
        });
      }

      return actions;
    },
  });
};
