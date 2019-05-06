import { BroccoliNode, BroccoliPluginOptions } from 'broccoli-plugin';

export default abstract class BroccoliPersistentFilter {
  /**
   * Abstract base-class for filtering purposes.
   *
   * Enforces that it is invoked on an instance of a class which prototypically
   * inherits from Filter, and which is not itself Filter.
   */
  constructor(inputNode: BroccoliNode, options: FilterOptions);
  /**
   * Abstract method `processString`: must be implemented on subclasses of
   * Filter.
   *
   * The resolved return value can either be an object or a string.
   *
   * An object can be used to cache additional meta-data that is not part of the
   * final output. When an object is returned, the `.output` property of that
   * object is used as the resulting file contents.
   *
   * When a string is returned it is used as the file contents.
   */
  abstract processString(
    contents: string,
    relativePath: string
  ): string | object;

  /**
   * Virtual method `getDestFilePath`: determine whether the source file should
   * be processed, and optionally rename the output file when processing occurs.
   *
   * Return `null` to pass the file through without processing. Return
   * `relativePath` to process the file with `processString`. Return a
   * different path to process the file with `processString` and rename it.
   *
   * By default, if the options passed into the `Filter` constructor contain a
   * property `extensions`, and `targetExtension` is supplied, the first matching
   * extension in the list is replaced with the `targetExtension` option's value.
   */
  getDestFilePath(relativePath: string): string;

  /**
   * Method `postProcess`: may be implemented on subclasses of
   * Filter.
   *
   * This method can be used in subclasses to do processing on the results of
   * each files `processString` method.
   *
   * A common scenario for this is linting plugins, where on initial build users
   * expect to get console warnings for lint errors, but we do not want to re-lint
   * each file on every boot (since most of them will be able to be served from the
   * cache).
   *
   * The `.output` property of the return value is used as the emitted file contents.
   */
  postProcess(results: object, relativePath: string): object;
}

type Encoding = 'utf8' | null;

interface FilterOptions {
  /**
   * An array of file extensions to process.
   *
   * @example ['md', 'markdown']
   */
  extensions: string[];

  /**
   * The file extension of the corresponding output files.
   *
   * @example 'html'
   */
  targetExtension: string;

  /**
   * The character encoding used for reading input files to be processed.
   * For binary files, pass `null` to receive a `Buffer` object in
   * `processString`.
   *
   * @default 'utf8'
   */
  inputEncoding?: Encoding;

  /**
   * The character encoding used for writing output files after processing.
   * For binary files, pass `null` and return a `Buffer` object from
   * `processString`.
   *
   * @default 'utf8'
   */
  outputEncoding?: Encoding;

  /**
   * Whether the create and change file operations are allowed to complete
   * asynchronously.
   *
   * @default false
   */
  async?: boolean;

  /**
   * The name of this plugin. Defaults to `this.constructor.name`.
   */
  name: BroccoliPluginOptions['name'];

  /**
   * A descriptive annotation. Useful for debugging, to tell multiple
   * instances of the same plugin apart.
   */
  annotation: BroccoliPluginOptions['annotation'];

  /**
   * Used with `async: true`.
   * The number of operations that can be run concurrently.
   *
   * This overrides the value set with `JOBS=n` environment variable.
   *
   * @default the number of detected CPU cores - 1, with a min of 1
   */
  concurrency: number;
}
