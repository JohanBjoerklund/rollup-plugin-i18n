import test from 'ava';
import {rollup} from 'rollup';
import i18n from '..';

const baseConfig = {
  plugins: [i18n({
    language: {
      'a': 'amy',
      'b': {
        'c': 'not_amy'
      }
    },
  })],
};

test('replace simple', async t => {
  for (let i = 0; i < 5; i++) {
    const bundle = await rollup({
      ...baseConfig,
      input: `test/fixture/fixture${i+1}.js`,
    });

    bundle.generate({format:'esm'})
      .then(({ output }) => {
        const { code } = output[0]

        t.true(code.indexOf('const a = "amy"') !== -1);
        t.true(code.indexOf('const c = "not_amy"') !== -1);
      });
  }
});
