import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$img: './static',
			'buffer-equal-constant-time': path.resolve(
				'./node_modules/buffer-equal-constant-time/index.js:3:21'
			),
			cloudinary: path.resolve('./node_modules/cloudinary/lib-es5/api_client/execute_request.js')
		}
	}
});
