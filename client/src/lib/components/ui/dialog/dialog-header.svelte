<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<!-- <div class={cn("flex justify-between items-center p-2.5 sm:p-5 rounded-t-lg text-center sm:text-left", className, "bg-[rgba(27,24,39,1)]" )} {...$$restProps}> -->
	<div class={cn("flex justify-between items-center p-2.5 sm:p-5 rounded-t-lg text-center sm:text-left ", className,"bg-[rgba(246,246,247)]", "font-[600]")} {...$$restProps}>

	<slot />
</div>
