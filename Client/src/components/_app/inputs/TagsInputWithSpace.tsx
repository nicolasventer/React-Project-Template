import type { TypedOmit } from "@/Shared/SharedUtils";
import type { TagsInputProps } from "@mantine/core";
import { TagsInput } from "@mantine/core";
import { useState } from "react";

export const TagsInputWithSpace = (props: TypedOmit<TagsInputProps, "searchValue" | "onSearchChange" | "splitChars">) => {
	const [searchValue, setSearchValue] = useState("");

	return (
		<TagsInput
			placeholder={'" for space escape'}
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			splitChars={searchValue.startsWith('"') ? ['"'] : [" "]}
			{...props}
		/>
	);
};
