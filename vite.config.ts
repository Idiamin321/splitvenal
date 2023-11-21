import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$img: './static'

			// cloudinary: path.resolve('./node_modules/cloudinary/lib-es5/api_client/execute_request.js')
		}
	}
});
