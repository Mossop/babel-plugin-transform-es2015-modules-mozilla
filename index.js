const t = require("babel-types");

module.exports = function() {
  let hasXPCOMModules = false;

  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;

        const specifier = path.node.specifiers[0];
        if (hasXPCOMModules && path.node.specifiers.length === 1 &&
            specifier.imported.name === specifier.local.name) {
          path.replaceWith(
            t.CallExpression(
              t.MemberExpression(
                t.Identifier("XPCOMUtils"),
                t.Identifier("defineLazyModuleGetter"),
                false
              ), [
                t.ThisExpression(),
                t.StringLiteral(specifier.local.name),
                t.StringLiteral(source)
              ]
            )
          );
        } else {
          const imports = path.node.specifiers.map(specifier => {
            return t.ObjectProperty(
              t.Identifier(specifier.imported.name),
              t.Identifier(specifier.local.name),
              false,
              specifier.imported.name === specifier.local.name
            )
          });

          path.replaceWith(
            t.VariableDeclaration("const", [
              t.VariableDeclarator(
                t.ObjectPattern(imports),
                t.CallExpression(
                  t.MemberExpression(
                    t.MemberExpression(
                      t.Identifier("Components"),
                      t.Identifier("utils"),
                      false
                    ),
                    t.Identifier("import"),
                    false
                  ), [
                    t.StringLiteral(source),
                    t.ObjectExpression([])
                  ]
                )
              )
            ])
          );

          if (source === "resource://gre/modules/XPCOMUtils.jsm") {
            hasXPCOMModules = true;
          }
        }
      },

      ExportNamedDeclaration(path) {
        const names = path.node.specifiers.map(specifier => {
          return t.StringLiteral(specifier.local.name);
        });

        path.replaceWith(
          t.ExpressionStatement(
            t.AssignmentExpression(
              "=",
              t.MemberExpression(
                t.ThisExpression(),
                t.Identifier("EXPORTED_SYMBOLS"),
                false
              ),
              t.ArrayExpression(names)
            )
          )
        );
      }
    },
  }
}