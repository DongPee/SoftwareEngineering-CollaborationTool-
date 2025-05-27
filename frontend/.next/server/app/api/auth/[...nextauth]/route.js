/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n/* harmony import */ var next_auth_providers_kakao__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/kakao */ \"(rsc)/./node_modules/next-auth/providers/kakao.js\");\n\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n    providers: [\n        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            clientId: process.env.GOOGLE_CLIENT_ID,\n            clientSecret: process.env.GOOGLE_CLIENT_SECRET\n        }),\n        (0,next_auth_providers_kakao__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({\n            clientId: process.env.KAKAO_CLIENT_ID,\n            clientSecret: process.env.KAKAO_CLIENT_SECRET,\n            authorization: {\n                url: \"https://kauth.kakao.com/oauth/authorize\",\n                params: {\n                    scope: \"profile_nickname account_email\"\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, account, profile }) {\n            if (account?.provider === \"kakao\") {\n                const kakaoProfile = profile;\n                token.name = kakaoProfile?.properties?.nickname ?? \"카카오 사용자\";\n                // 디버깅용: rawProfile 저장\n                token.rawProfile = kakaoProfile;\n            } else if (profile) {\n                token.name = profile.name;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.name = token.name;\n                // 디버깅용: rawProfile 콘솔에 찍기\n                console.log(\"🔥 session 내부의 rawProfile:\", token.rawProfile);\n            }\n            return session;\n        }\n    }\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBaUM7QUFDdUI7QUFDRjtBQW9CdEQsTUFBTUcsVUFBVUgsZ0RBQVFBLENBQUM7SUFDdkJJLFdBQVc7UUFDVEgsc0VBQWNBLENBQUM7WUFDYkksVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0I7WUFDdENDLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0csb0JBQW9CO1FBQ2hEO1FBQ0FSLHFFQUFhQSxDQUFDO1lBQ1pHLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0ksZUFBZTtZQUNyQ0YsY0FBY0gsUUFBUUMsR0FBRyxDQUFDSyxtQkFBbUI7WUFDN0NDLGVBQWU7Z0JBQ2JDLEtBQUs7Z0JBQ0xDLFFBQVE7b0JBQ05DLE9BQU87Z0JBQ1Q7WUFDRjtRQUNGO0tBQ0Q7SUFDREMsV0FBVztRQUNULE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFQyxPQUFPLEVBQUVDLE9BQU8sRUFBRTtZQUNuQyxJQUFJRCxTQUFTRSxhQUFhLFNBQVM7Z0JBQ2pDLE1BQU1DLGVBQWVGO2dCQUNyQkYsTUFBTUssSUFBSSxHQUFHRCxjQUFjRSxZQUFZQyxZQUFZO2dCQUVuRCxzQkFBc0I7Z0JBQ3RCUCxNQUFNUSxVQUFVLEdBQUdKO1lBQ3JCLE9BQU8sSUFBSUYsU0FBUztnQkFDbEJGLE1BQU1LLElBQUksR0FBR0gsUUFBUUcsSUFBSTtZQUMzQjtZQUNBLE9BQU9MO1FBQ1Q7UUFDQSxNQUFNUyxTQUFRLEVBQUVBLE9BQU8sRUFBRVQsS0FBSyxFQUFFO1lBQzlCLElBQUlTLFFBQVFDLElBQUksRUFBRTtnQkFDaEJELFFBQVFDLElBQUksQ0FBQ0wsSUFBSSxHQUFHTCxNQUFNSyxJQUFJO2dCQUU5QiwwQkFBMEI7Z0JBQzFCTSxRQUFRQyxHQUFHLENBQUMsOEJBQThCWixNQUFNUSxVQUFVO1lBQzVEO1lBQ0EsT0FBT0M7UUFDVDtJQUNGO0FBQ0Y7QUFFMkMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYWNib29rL0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9jb21+YXBwbGV+Q2xvdWREb2NzL+GEgOGFreGEguGFouGEkuGFquGGr+GEg+GFqeGGvC/hhIPhhaLhhJLhhaHhhqgvM+GEkuGFoeGGqOGEguGFp+GGqzHhhJLhhaHhhqjhhIDhhbUv4YSJ4YWp4YSR4YWz4YSQ4YWz4YSL4YWw4YSL4YWl4YSA4YWp4Ya84YSS4YWh4YaoL3N3ZXAxNS9mcm9udGVuZC9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IEdvb2dsZVByb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2dvb2dsZVwiO1xuaW1wb3J0IEtha2FvUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMva2FrYW9cIjtcbmludGVyZmFjZSBLYWthb1Byb2ZpbGUge1xuICBpZDogbnVtYmVyO1xuICBjb25uZWN0ZWRfYXQ6IHN0cmluZztcbiAgcHJvcGVydGllczoge1xuICAgIG5pY2tuYW1lOiBzdHJpbmc7XG4gIH07XG4gIGtha2FvX2FjY291bnQ6IHtcbiAgICBwcm9maWxlX25pY2tuYW1lX25lZWRzX2FncmVlbWVudDogYm9vbGVhbjtcbiAgICBwcm9maWxlOiB7XG4gICAgICBuaWNrbmFtZTogc3RyaW5nO1xuICAgICAgaXNfZGVmYXVsdF9uaWNrbmFtZTogYm9vbGVhbjtcbiAgICB9O1xuICAgIGhhc19lbWFpbDogYm9vbGVhbjtcbiAgICBlbWFpbF9uZWVkc19hZ3JlZW1lbnQ6IGJvb2xlYW47XG4gICAgaXNfZW1haWxfdmFsaWQ6IGJvb2xlYW47XG4gICAgaXNfZW1haWxfdmVyaWZpZWQ6IGJvb2xlYW47XG4gICAgZW1haWw6IHN0cmluZztcbiAgfTtcbn1cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aCh7XG4gIHByb3ZpZGVyczogW1xuICAgIEdvb2dsZVByb3ZpZGVyKHtcbiAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEISxcbiAgICAgIGNsaWVudFNlY3JldDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQhLFxuICAgIH0pLFxuICAgIEtha2FvUHJvdmlkZXIoe1xuICAgICAgY2xpZW50SWQ6IHByb2Nlc3MuZW52LktBS0FPX0NMSUVOVF9JRCEsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LktBS0FPX0NMSUVOVF9TRUNSRVQhLFxuICAgICAgYXV0aG9yaXphdGlvbjoge1xuICAgICAgICB1cmw6IFwiaHR0cHM6Ly9rYXV0aC5rYWthby5jb20vb2F1dGgvYXV0aG9yaXplXCIsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHNjb3BlOiBcInByb2ZpbGVfbmlja25hbWUgYWNjb3VudF9lbWFpbFwiLCAvLyDihpAg7J2066mU7J28IOuwm+q4sCDsnITtlbQg6rytIO2PrO2VqCFcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCBhY2NvdW50LCBwcm9maWxlIH0pIHtcbiAgICAgIGlmIChhY2NvdW50Py5wcm92aWRlciA9PT0gXCJrYWthb1wiKSB7XG4gICAgICAgIGNvbnN0IGtha2FvUHJvZmlsZSA9IHByb2ZpbGUgYXMgS2FrYW9Qcm9maWxlO1xuICAgICAgICB0b2tlbi5uYW1lID0ga2FrYW9Qcm9maWxlPy5wcm9wZXJ0aWVzPy5uaWNrbmFtZSA/PyBcIuy5tOy5tOyYpCDsgqzsmqnsnpBcIjtcbiAgXG4gICAgICAgIC8vIOuUlOuyhOq5heyaqTogcmF3UHJvZmlsZSDsoIDsnqVcbiAgICAgICAgdG9rZW4ucmF3UHJvZmlsZSA9IGtha2FvUHJvZmlsZTtcbiAgICAgIH0gZWxzZSBpZiAocHJvZmlsZSkge1xuICAgICAgICB0b2tlbi5uYW1lID0gcHJvZmlsZS5uYW1lO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgIGlmIChzZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgc2Vzc2lvbi51c2VyLm5hbWUgPSB0b2tlbi5uYW1lO1xuICBcbiAgICAgICAgLy8g65SU67KE6rmF7JqpOiByYXdQcm9maWxlIOy9mOyGlOyXkCDssI3quLBcbiAgICAgICAgY29uc29sZS5sb2coXCLwn5SlIHNlc3Npb24g64K067aA7J2YIHJhd1Byb2ZpbGU6XCIsIHRva2VuLnJhd1Byb2ZpbGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07Il0sIm5hbWVzIjpbIk5leHRBdXRoIiwiR29vZ2xlUHJvdmlkZXIiLCJLYWthb1Byb3ZpZGVyIiwiaGFuZGxlciIsInByb3ZpZGVycyIsImNsaWVudElkIiwicHJvY2VzcyIsImVudiIsIkdPT0dMRV9DTElFTlRfSUQiLCJjbGllbnRTZWNyZXQiLCJHT09HTEVfQ0xJRU5UX1NFQ1JFVCIsIktBS0FPX0NMSUVOVF9JRCIsIktBS0FPX0NMSUVOVF9TRUNSRVQiLCJhdXRob3JpemF0aW9uIiwidXJsIiwicGFyYW1zIiwic2NvcGUiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsImFjY291bnQiLCJwcm9maWxlIiwicHJvdmlkZXIiLCJrYWthb1Byb2ZpbGUiLCJuYW1lIiwicHJvcGVydGllcyIsIm5pY2tuYW1lIiwicmF3UHJvZmlsZSIsInNlc3Npb24iLCJ1c2VyIiwiY29uc29sZSIsImxvZyIsIkdFVCIsIlBPU1QiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_macbook_Library_Mobile_Documents_com_apple_CloudDocs_3_1_swep15_frontend_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/macbook/Library/Mobile Documents/com~apple~CloudDocs/교내활동/대학/3학년1학기/소프트웨어공학/swep15/frontend/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_macbook_Library_Mobile_Documents_com_apple_CloudDocs_3_1_swep15_frontend_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hY2Jvb2slMkZMaWJyYXJ5JTJGTW9iaWxlJTIwRG9jdW1lbnRzJTJGY29tfmFwcGxlfkNsb3VkRG9jcyUyRiVFMSU4NCU4MCVFMSU4NSVBRCVFMSU4NCU4MiVFMSU4NSVBMiVFMSU4NCU5MiVFMSU4NSVBQSVFMSU4NiVBRiVFMSU4NCU4MyVFMSU4NSVBOSVFMSU4NiVCQyUyRiVFMSU4NCU4MyVFMSU4NSVBMiVFMSU4NCU5MiVFMSU4NSVBMSVFMSU4NiVBOCUyRjMlRTElODQlOTIlRTElODUlQTElRTElODYlQTglRTElODQlODIlRTElODUlQTclRTElODYlQUIxJUUxJTg0JTkyJUUxJTg1JUExJUUxJTg2JUE4JUUxJTg0JTgwJUUxJTg1JUI1JTJGJUUxJTg0JTg5JUUxJTg1JUE5JUUxJTg0JTkxJUUxJTg1JUIzJUUxJTg0JTkwJUUxJTg1JUIzJUUxJTg0JThCJUUxJTg1JUIwJUUxJTg0JThCJUUxJTg1JUE1JUUxJTg0JTgwJUUxJTg1JUE5JUUxJTg2JUJDJUUxJTg0JTkyJUUxJTg1JUExJUUxJTg2JUE4JTJGc3dlcDE1JTJGZnJvbnRlbmQlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGbWFjYm9vayUyRkxpYnJhcnklMkZNb2JpbGUlMjBEb2N1bWVudHMlMkZjb21+YXBwbGV+Q2xvdWREb2NzJTJGJUUxJTg0JTgwJUUxJTg1JUFEJUUxJTg0JTgyJUUxJTg1JUEyJUUxJTg0JTkyJUUxJTg1JUFBJUUxJTg2JUFGJUUxJTg0JTgzJUUxJTg1JUE5JUUxJTg2JUJDJTJGJUUxJTg0JTgzJUUxJTg1JUEyJUUxJTg0JTkyJUUxJTg1JUExJUUxJTg2JUE4JTJGMyVFMSU4NCU5MiVFMSU4NSVBMSVFMSU4NiVBOCVFMSU4NCU4MiVFMSU4NSVBNyVFMSU4NiVBQjElRTElODQlOTIlRTElODUlQTElRTElODYlQTglRTElODQlODAlRTElODUlQjUlMkYlRTElODQlODklRTElODUlQTklRTElODQlOTElRTElODUlQjMlRTElODQlOTAlRTElODUlQjMlRTElODQlOEIlRTElODUlQjAlRTElODQlOEIlRTElODUlQTUlRTElODQlODAlRTElODUlQTklRTElODYlQkMlRTElODQlOTIlRTElODUlQTElRTElODYlQTglMkZzd2VwMTUlMkZmcm9udGVuZCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDK0c7QUFDNUw7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9tYWNib29rL0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9jb21+YXBwbGV+Q2xvdWREb2NzL+GEgOGFreGEguGFouGEkuGFquGGr+GEg+GFqeGGvC/hhIPhhaLhhJLhhaHhhqgvM+GEkuGFoeGGqOGEguGFp+GGqzHhhJLhhaHhhqjhhIDhhbUv4YSJ4YWp4YSR4YWz4YSQ4YWz4YSL4YWw4YSL4YWl4YSA4YWp4Ya84YSS4YWh4YaoL3N3ZXAxNS9mcm9udGVuZC9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvbWFjYm9vay9MaWJyYXJ5L01vYmlsZSBEb2N1bWVudHMvY29tfmFwcGxlfkNsb3VkRG9jcy/hhIDhha3hhILhhaLhhJLhharhhq/hhIPhhanhhrwv4YSD4YWi4YSS4YWh4YaoLzPhhJLhhaHhhqjhhILhhafhhqsx4YSS4YWh4Yao4YSA4YW1L+GEieGFqeGEkeGFs+GEkOGFs+GEi+GFsOGEi+GFpeGEgOGFqeGGvOGEkuGFoeGGqC9zd2VwMTUvZnJvbnRlbmQvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/preact","vendor-chunks/object-hash","vendor-chunks/lru-cache","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmacbook%2FLibrary%2FMobile%20Documents%2Fcom~apple~CloudDocs%2F%E1%84%80%E1%85%AD%E1%84%82%E1%85%A2%E1%84%92%E1%85%AA%E1%86%AF%E1%84%83%E1%85%A9%E1%86%BC%2F%E1%84%83%E1%85%A2%E1%84%92%E1%85%A1%E1%86%A8%2F3%E1%84%92%E1%85%A1%E1%86%A8%E1%84%82%E1%85%A7%E1%86%AB1%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%B5%2F%E1%84%89%E1%85%A9%E1%84%91%E1%85%B3%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%A5%E1%84%80%E1%85%A9%E1%86%BC%E1%84%92%E1%85%A1%E1%86%A8%2Fswep15%2Ffrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();